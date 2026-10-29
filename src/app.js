/* ===== TarotParot app ===== */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const fmt = n => Number(n).toLocaleString();
/* phones and tablets shuffle by touch and motion; computers by mouse, scrolling and keys */
const IS_TOUCH = matchMedia("(hover: none) and (pointer: coarse)").matches;
const DEV = IS_TOUCH ? "phone" : "computer";
const COPY = IS_TOUCH ? {
  lede: "Every deck here is shuffled by you: your touch, the way your phone moves, the moon and the minute you ask. No two shuffles are ever the same.",
  instr: "Swirl your finger over the cards. Shake your phone too, if you like. Stop when it feels right.",
  l1: "Touch", l2: "Motion", install: "Add TarotParot to your home screen"
} : {
  lede: "Every deck here is shuffled by you: the way you move your mouse, the rhythm of your typing, the moon and the minute you ask. No two shuffles are ever the same.",
  instr: "Swirl your mouse over the cards. Scroll over them or tap a few keys too, if you like. Stop when it feels right.",
  l1: "Mouse", l2: "Scroll", install: "Install TarotParot as an app"
};

/* ---------- the sky right now ---------- */
const SYN = 29.530588853;
const MOONS = ["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];
const MOON_TEXT = [
  "a time for setting intentions and planting seeds",
  "a time to take the first small steps",
  "a time for decisions and pushing through resistance",
  "a time for refining, and for patience before the peak",
  "a time when things come to light and feelings run high",
  "a time for gratitude and sharing what you have learned",
  "a time for releasing and forgiving",
  "a time for rest before the next cycle begins"
];
function moonInfo(d) {
  let age = ((d.getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000) % SYN;
  if (age < 0) age += SYN;
  const frac = age / SYN, idx = Math.floor(frac * 8 + .5) % 8;
  return { name: MOONS[idx], idx, frac, illum: (1 - Math.cos(2 * Math.PI * frac)) / 2 };
}
const SIGNS = [["Capricorn",1,1],["Aquarius",1,20],["Pisces",2,19],["Aries",3,21],["Taurus",4,20],["Gemini",5,21],["Cancer",6,21],["Leo",7,23],["Virgo",8,23],["Libra",9,23],["Scorpio",10,23],["Sagittarius",11,22],["Capricorn",12,22]];
function sunSign(d) { const v = (d.getMonth() + 1) * 100 + d.getDate(); let s = "Capricorn"; for (const [n, m, dd] of SIGNS) if (v >= m * 100 + dd) s = n; return s; }
const RULERS = ["the Sun","the Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const weekday = d => d.toLocaleDateString([], { weekday: "long" });
const timeOf = d => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const dateOf = d => d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
function tzShort(d) { try { return d.toLocaleTimeString([], { timeZoneName: "short" }).split(" ").pop(); } catch (e) { return ""; } }
const moonName = n => /Moon$/.test(n) ? n : n + " Moon";
function skyLine(d = new Date()) { const m = moonInfo(d); return `${weekday(d)} · ${moonName(m.name)}, ${Math.round(m.illum * 100)}% lit · Sun in ${sunSign(d)}`; }

function birthCard(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || y < 1000) return null;
  let n = y + m + d;
  while (n > 21) n = String(n).split("").reduce((a, b) => a + Number(b), 0);
  return DECK[n];
}

/* ---------- spreads ---------- */
const SPREADS = {
  single: { name: "Single Pull", positions: [{ t: "Your card", d: "the message you most need right now" }] },
  three: { name: "Past · Present · Future", positions: [{ t: "Past", d: "what shaped this" }, { t: "Present", d: "where you stand now" }, { t: "Future", d: "where this is heading" }] },
  celtic: { name: "Celtic Cross", positions: [
    { t: "The Heart of It", d: "the core of the situation" },
    { t: "The Crossing", d: "what challenges you" },
    { t: "The Root", d: "the foundation beneath it" },
    { t: "The Recent Past", d: "what is passing away" },
    { t: "The Crown", d: "your hope, or the best that could come" },
    { t: "The Near Future", d: "what is approaching" },
    { t: "Yourself", d: "how you are meeting this" },
    { t: "Your Surroundings", d: "other people and outside forces" },
    { t: "Hopes and Fears", d: "what you hope for, or fear" },
    { t: "The Outcome", d: "where this is likely to lead" }
  ] }
};
// Celtic Cross layout: centers as fractions of the spread's width (the box is 1 wide × 1.24 tall)
const CELTIC = [[.36,.62],[.36,.62],[.36,.93],[.17,.62],[.36,.31],[.55,.62],[.88,1.093],[.88,.778],[.88,.464],[.88,.149]];

/* ---------- state ---------- */
const S = { spread: "three", question: "", bday: "", reversals: true, deck: null, piles: null, picks: [], reading: null, report: null, stream: null, saved: false };

/* ---------- entropy: everything that shapes the shuffle ---------- */
const Ent = {
  nums: [], touch: 0, motion: 0, moves: 0, scroll: 0, keys: 0, lastKey: 0, path: 0, v: 0, motionSeen: false, lastAcc: null, lastOri: null,
  add(...a) { for (const x of a) { const n = +x; if (Number.isFinite(n) && this.nums.length < 90000) this.nums.push(n); } },
  reset() { this.nums = []; this.touch = 0; this.motion = 0; this.moves = 0; this.lastAcc = null; this.lastOri = null; this.scroll = 0; this.keys = 0; this.lastKey = 0; this.path = 0; this.v = 0; this.motionSeen = false; }
};
const TARGET = 240;
// The ring only fills from what you do on the shuffle screen: swirls, real shakes, scrolls and key taps there.
const score = () => Ent.touch + Ent.moves * .5 + Ent.scroll * 2;

const enc = new TextEncoder();
function cat(...arrs) { let len = 0; for (const a of arrs) len += a.length; const out = new Uint8Array(len); let o = 0; for (const a of arrs) { out.set(a, o); o += a.length; } return out; }
function fallbackHash(bytes) {
  const h = new Uint32Array(8);
  for (let i = 0; i < 8; i++) h[i] = (0x9e3779b1 ^ Math.imul(i + 1, 0x85ebca6b)) >>> 0;
  for (let i = 0; i < bytes.length; i++) { const k = i & 7; h[k] = Math.imul(h[k] ^ bytes[i], 0x01000193); h[(k + 1) & 7] ^= h[k] >>> 13; }
  for (let r = 0; r < 6; r++) for (let i = 0; i < 8; i++) { h[i] ^= h[(i + 3) & 7] >>> 16; h[i] = Math.imul(h[i], 0x85ebca6b); h[i] ^= h[i] >>> 13; }
  const rnd = new Uint32Array(8); crypto.getRandomValues(rnd);
  for (let i = 0; i < 8; i++) h[i] ^= rnd[i];
  return new Uint8Array(h.buffer);
}
async function sha256(bytes) {
  if (window.crypto && crypto.subtle) { try { return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)); } catch (e) { /* fall through */ } }
  return fallbackHash(bytes);
}
const hex = b => [...b].map(x => x.toString(16).padStart(2, "0")).join("");
async function makeStream(seed) {
  const blocks = await Promise.all(Array.from({ length: 64 }, (_, i) => sha256(cat(seed, new Uint8Array([i >> 8, i & 255])))));
  const bytes = cat(...blocks); let p = 0;
  const u32 = () => {
    if (p + 4 > bytes.length) { crypto.getRandomValues(bytes); p = 0; }
    const v = ((bytes[p] << 24) | (bytes[p + 1] << 16) | (bytes[p + 2] << 8) | bytes[p + 3]) >>> 0; p += 4; return v;
  };
  return { u32, int(n) { const lim = Math.floor(4294967296 / n) * n; let v; do { v = u32(); } while (v >= lim); return v % n; } };
}
async function deviceSignals() {
  const s = { screen: `${screen.width}×${screen.height}`, dpr: devicePixelRatio, lang: navigator.language, cores: navigator.hardwareConcurrency || 0, mem: navigator.deviceMemory || 0, touchPoints: navigator.maxTouchPoints || 0, orient: (screen.orientation && screen.orientation.type) || "", conn: (navigator.connection && navigator.connection.effectiveType) || "" };
  try {
    if (navigator.getBattery) {
      const b = await Promise.race([navigator.getBattery(), new Promise((_, rej) => setTimeout(rej, 500))]);
      s.battery = Math.round(b.level * 100); s.charging = !!b.charging;
    }
  } catch (e) { /* not available */ }
  return s;
}
function timingJitter() {
  const out = [];
  for (let i = 0; i < 48; i++) { const t0 = performance.now(); let x = i; for (let j = 0; j < 1500; j++) x = (x * 1.000001 + Math.sqrt(j + x)) % 997; out.push(performance.now() - t0, x); }
  return out;
}

/* ---------- views ---------- */
let current = "home";
function go(name) {
  const prev = current; current = name;
  $$(".view").forEach(v => v.classList.toggle("active", v.id === "v-" + name));
  window.scrollTo(0, 0);
  if (prev === "shuffle" && name !== "shuffle") stopMotion();
  ({ home: enterHome, shuffle: enterShuffle, cut: enterCut, pick: enterPick, journal: enterJournal })[name]?.();
}
document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

/* ---------- 1. ask ---------- */
const prefs = store.get("tp.prefs", {});
let savedBday = prefs.bday || "";
if (prefs.reversals === false) $("#rev").checked = false;
if (prefs.spread && SPREADS[prefs.spread]) { const r = $(`input[name="spread"][value="${prefs.spread}"]`); if (r) r.checked = true; }
function prettyDate(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" }); }
function savePrefs() { store.set("tp.prefs", { bday: savedBday, reversals: $("#rev").checked, spread: ($('input[name="spread"]:checked') || {}).value || "three" }); }
function showBirthday() {
  const c = birthCard(savedBday);
  $("#bdayValue").textContent = savedBday ? prettyDate(savedBday) : "Not added yet";
  $("#birthCard").textContent = c ? `Your birth card is ${c.name}.` : "Add it to find your birth card and weave it into every shuffle.";
  $("#bdayEdit").textContent = savedBday ? "Edit" : "Add your birthday";
  $("#bdayRemove").hidden = !savedBday;
}
function editBirthday(open) {
  $("#bdayView").hidden = open; $("#bdayEditBox").hidden = !open;
  if (open) { $("#bday").value = savedBday; $("#bdayErr").textContent = ""; $("#bday").focus(); }
  else $("#bdayEdit").focus();
}
$("#bdayEdit").addEventListener("click", () => editBirthday(true));
$("#bdayCancel").addEventListener("click", () => editBirthday(false));
$("#bdaySave").addEventListener("click", () => {
  const v = $("#bday").value;
  if (!v || !birthCard(v)) { $("#bdayErr").textContent = "Pick your full birthday: month, day and year."; return; }
  if (new Date(v) > new Date()) { $("#bdayErr").textContent = "That date is in the future. Check the year."; return; }
  savedBday = v; savePrefs(); showBirthday(); editBirthday(false); toast("Birthday saved");
});
$("#bdayRemove").addEventListener("click", () => { savedBday = ""; savePrefs(); showBirthday(); toast("Birthday removed"); });
$("#bday").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); $("#bdaySave").click(); } });
showBirthday();

function enterHome() {
  Ent.reset(); S.deck = null; S.picks = []; S.reading = null; S.saved = false;
  $("#skyLine").textContent = skyLine();
}
$("#q").addEventListener("keydown", e => {
  const now = performance.now();
  if (Ent.lastKey) Ent.add(now - Ent.lastKey);
  Ent.lastKey = now; Ent.keys++;
});
$("#askForm").addEventListener("submit", e => {
  e.preventDefault();
  S.question = $("#q").value.trim();
  S.spread = ($('input[name="spread"]:checked') || {}).value || "three";
  S.bday = savedBday;
  S.reversals = $("#rev").checked;
  savePrefs();
  go("shuffle");
});

/* ---------- 2. shuffle ---------- */
const zone = $("#deckZone"), deckCards = $$("#deck i"), ring = $("#ringFill");
let lastP = null, raf = 0, meterQueued = false;
function updateMeters() {
  meterQueued = false;
  $("#mTouch").textContent = fmt(Ent.touch);
  $("#mMotion").textContent = fmt(IS_TOUCH ? Ent.moves : Ent.scroll);
  $("#mKeys").textContent = fmt(Ent.keys);
  const pct = Math.min(1, score() / TARGET);
  ring.style.strokeDashoffset = String(100 - pct * 100);
  const btn = $("#shuffleDone");
  if (btn.dataset.busy) return;
  btn.disabled = pct < 1;
  btn.textContent = pct < 1 ? `Keep swirling · ${Math.round(pct * 100)}%` : "Seal the shuffle";
}
const queueMeters = () => { if (!meterQueued) { meterQueued = true; requestAnimationFrame(updateMeters); } };
/* The deck really shuffles: cards slide out, then slip back in over or under the others. */
const order = deckCards.map((_, i) => i);            // bottom → top
const st = deckCards.map(() => ({ mv: null }));
let lastDir = { x: 1, y: 0 }, lastLaunch = 0;
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeInOut = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
function restack() { order.forEach((ci, pos) => { deckCards[ci].style.zIndex = String(pos + 1); }); }
restack();
function launch(t) {
  const free = deckCards.map((_, i) => i).filter(i => !st[i].mv);
  if (!free.length) return;
  const ci = free[Math.floor(Math.random() * free.length)];
  const w = $("#deck").offsetWidth || 100;
  const ang = Math.atan2(lastDir.y, lastDir.x) + (Math.random() - .5) * 1.4 + (Math.random() < .35 ? Math.PI : 0);
  const dist = w * (.85 + Math.random() * .55), over = Math.random() < .5;
  st[ci].mv = { t0: t, dur: 480 + Math.random() * 280, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist * .75, rot: (Math.random() - .5) * 46, over, swapped: false };
}
function deckLoop(t) {
  if (current !== "shuffle") { raf = 0; return; }
  Ent.v *= .94;
  const inFlight = st.filter(x => x.mv).length;
  const want = reduceMotion ? 0 : Math.min(5, Math.floor(Ent.v / 5));
  if (inFlight < want && t - lastLaunch > 110) { launch(t); lastLaunch = t; }
  const n = deckCards.length;
  deckCards.forEach((el, ci) => {
    const s = st[ci];
    let pos = order.indexOf(ci), x = -pos * .9, y = -pos * .9, a = 0, sc = 1, lift = 0;
    if (s.mv) {
      const m = s.mv, p = Math.min(1, (t - m.t0) / m.dur);
      if (p < .5) {
        const e = easeOut(p / .5);
        x += m.dx * e; y += m.dy * e; a = m.rot * e; lift = e;
      } else {
        if (!m.swapped) {
          m.swapped = true;
          order.splice(order.indexOf(ci), 1);
          const dest = m.over ? order.length : Math.floor(Math.random() * Math.max(1, order.length * .45));
          order.splice(dest, 0, ci);
          restack();
          pos = order.indexOf(ci); x = -pos * .9; y = -pos * .9;
        }
        const e = 1 - easeInOut((p - .5) / .5);
        x += m.dx * e; y += m.dy * e; a = m.rot * e; lift = e;
      }
      sc = 1 + (m.over ? .06 : -.04) * lift;
      if (p >= 1) s.mv = null;
    } else {
      const k = (pos + 1) / n;
      a = Math.sin(t * .006 + ci * 1.9) * Ent.v * .22 * k;
      x += Math.cos(t * .005 + ci * 2.3) * Ent.v * .35 * k;
      y += Math.sin(t * .004 + ci * 1.1) * Ent.v * .22 * k;
    }
    el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    el.style.boxShadow = lift > .05 ? `0 ${6 + lift * 14}px ${16 + lift * 18}px rgba(10,4,6,${(.45 + lift * .15).toFixed(2)})` : "";
  });
  raf = requestAnimationFrame(deckLoop);
}
zone.addEventListener("pointerdown", e => {
  try { zone.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  lastP = { x: e.clientX, y: e.clientY };
  Ent.add(e.clientX, e.clientY, e.timeStamp, e.pressure || 0);
  Ent.v = Math.min(40, Ent.v + 7);
});
zone.addEventListener("pointermove", e => {
  if (current !== "shuffle") return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const c of (evs.length ? evs : [e])) { Ent.add(c.clientX, c.clientY, c.timeStamp, c.pressure || 0, c.width || 0, c.tiltX || 0); Ent.touch++; }
  if (lastP) {
    const dx = e.clientX - lastP.x, dy = e.clientY - lastP.y, d = Math.hypot(dx, dy);
    Ent.path += d; Ent.v = Math.min(40, Ent.v + d * .15);
    if (d > 1.5) lastDir = { x: dx / d, y: dy / d };
  }
  lastP = { x: e.clientX, y: e.clientY };
  queueMeters();
});
zone.addEventListener("pointerup", () => { lastP = null; });
zone.addEventListener("wheel", e => {
  if (current !== "shuffle") return;
  e.preventDefault();
  Ent.add(e.deltaX, e.deltaY, e.deltaZ, e.deltaMode, e.timeStamp, e.clientX, e.clientY); Ent.scroll++;
  Ent.v = Math.min(40, Ent.v + Math.min(10, 2 + Math.abs(e.deltaY) * .04));
  queueMeters();
}, { passive: false });
document.addEventListener("keydown", e => {
  if (current !== "shuffle" || e.key === "Tab" || e.metaKey || e.ctrlKey) return;
  if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest("button")) return;
  e.preventDefault();
  Ent.add(e.timeStamp, e.key.length, e.repeat ? 1 : 0); Ent.touch += 8; Ent.v = Math.min(40, Ent.v + 8);
  queueMeters();
});
function onMotion(e) {
  const a = e.accelerationIncludingGravity || e.acceleration || {}, r = e.rotationRate || {};
  if (a.x == null && r.alpha == null) return;
  Ent.add(a.x, a.y, a.z, r.alpha, r.beta, r.gamma, e.timeStamp); Ent.motion++; Ent.motionSeen = true;
  const acc = e.acceleration;
  let mag;
  if (acc && acc.x != null) mag = Math.hypot(acc.x, acc.y, acc.z);
  else { const L = Ent.lastAcc; mag = L ? Math.hypot((a.x || 0) - L.x, (a.y || 0) - L.y, (a.z || 0) - L.z) : 0; Ent.lastAcc = { x: a.x || 0, y: a.y || 0, z: a.z || 0 }; }
  const spin = Math.hypot(r.alpha || 0, r.beta || 0, r.gamma || 0);
  if (mag > 1.5 || spin > 45) { Ent.moves++; Ent.v = Math.min(40, Ent.v + Math.min(8, mag + spin / 60)); queueMeters(); }
}
function onOrient(e) {
  if (e.alpha == null && e.beta == null) return;
  Ent.add(e.alpha, e.beta, e.gamma, e.timeStamp); Ent.motion++; Ent.motionSeen = true;
  const L = Ent.lastOri, b = e.beta || 0, g = e.gamma || 0;
  if (!L) { Ent.lastOri = { b, g }; return; }
  if (Math.abs(b - L.b) + Math.abs(g - L.g) > 4) { Ent.moves++; Ent.lastOri = { b, g }; queueMeters(); }
}
function startMotion() { window.addEventListener("devicemotion", onMotion); window.addEventListener("deviceorientation", onOrient); }
function stopMotion() { window.removeEventListener("devicemotion", onMotion); window.removeEventListener("deviceorientation", onOrient); }
$("#motionBtn").addEventListener("click", async () => {
  const note = $("#motionNote");
  try {
    const res = await DeviceMotionEvent.requestPermission();
    try { if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) await DeviceOrientationEvent.requestPermission(); } catch (e) { /* motion alone is enough */ }
    if (res === "granted") { startMotion(); $("#motionBtn").hidden = true; note.textContent = "Now shake or tilt your phone."; }
    else note.textContent = "Motion is off. Your touch is plenty.";
  } catch (e) { $("#motionBtn").hidden = true; note.textContent = "Motion isn't available here. Your touch is plenty."; }
});
function enterShuffle() {
  Ent.touch = 0; Ent.motion = 0; Ent.moves = 0; Ent.lastAcc = null; Ent.lastOri = null; Ent.scroll = 0; Ent.path = 0; Ent.v = 6;
  const btn = $("#shuffleDone"); delete btn.dataset.busy;
  ring.style.transition = "none"; ring.style.strokeDashoffset = "100";
  void ring.getBoundingClientRect();
  requestAnimationFrame(() => { ring.style.transition = ""; });
  const needsPerm = IS_TOUCH && typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function";
  $("#motionBtn").hidden = !needsPerm;
  $("#motionNote").textContent = "";
  if (IS_TOUCH && !needsPerm) startMotion();
  if (!IS_TOUCH) { try { zone.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  updateMeters();
  if (!raf) raf = requestAnimationFrame(deckLoop);
}
$("#shuffleDone").addEventListener("click", seal);

async function seal() {
  const btn = $("#shuffleDone");
  btn.dataset.busy = "1"; btn.disabled = true; btn.textContent = "Sealing your shuffle…";
  stopMotion();
  Ent.add(...timingJitter());
  const now = new Date(), dev = await deviceSignals(), moon = moonInfo(now);
  const context = { question: S.question, bday: S.bday, spread: S.spread, reversals: S.reversals, when: now.toISOString(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone, moon: moon.frac, sun: sunSign(now), dev };
  const rnd = new Uint8Array(32); crypto.getRandomValues(rnd);
  const seed = await sha256(cat(new Uint8Array(new Float64Array(Ent.nums).buffer), enc.encode(JSON.stringify(context)), rnd));
  const stream = await makeStream(seed);
  const order = Array.from({ length: 78 }, (_, i) => i);
  for (let i = 77; i > 0; i--) { const j = stream.int(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  S.deck = order.map(id => ({ id, rev: S.reversals && stream.int(1000) < 400 }));
  S.stream = stream;
  S.report = {
    kind: DEV, touch: Ent.touch, path: Math.round(Ent.path), motion: Ent.motion, scroll: Ent.scroll, motionSeen: Ent.motionSeen, keys: Ent.keys, samples: Ent.nums.length,
    when: now.toISOString(), tz: tzShort(now), moon: { name: moon.name, illum: moon.illum, idx: moon.idx }, sun: sunSign(now), ruler: RULERS[now.getDay()],
    dev, qLen: S.question.length, bday: !!S.bday, seed: hex(seed)
  };
  go("cut");
}

/* ---------- 3. cut ---------- */
function enterCut() {
  const a = 22 + S.stream.int(10), b = 48 + S.stream.int(10);
  S.piles = [S.deck.slice(0, a), S.deck.slice(a, b), S.deck.slice(b)];
  const names = ["Left", "Middle", "Right"];
  $("#piles").innerHTML = S.piles.map((p, k) => `<button class="pile" type="button" data-k="${k}" aria-label="${names[k]} pile, ${p.length} cards"><span class="stack">${Array.from({ length: Math.min(6, Math.ceil(p.length / 5)) }, (_, i) => `<i style="transform:translate(${-i * 1.6}px,${-i * 1.6}px)"></i>`).join("")}</span><span>${p.length} cards</span></button>`).join("");
}
$("#piles").addEventListener("click", e => {
  const b = e.target.closest(".pile"); if (!b || $("#piles").dataset.locked) return;
  const k = +b.dataset.k;
  $("#piles").dataset.locked = "1";
  $$(".pile").forEach(p => p.classList.add(p === b ? "chosen" : "faded"));
  S.deck = [...S.piles[k], ...S.piles.filter((_, i) => i !== k).flat()];
  S.report.cut = { pile: ["left", "middle", "right"][k], size: S.piles[k].length };
  setTimeout(() => { delete $("#piles").dataset.locked; go("pick"); }, reduceMotion ? 100 : 650);
});

/* ---------- 4. pick ---------- */
const need = () => SPREADS[S.spread].positions.length;
function enterPick() {
  const n = need(); S.picks = [];
  $("#pickInstr").textContent = n === 1 ? "Pick one card. Go with the first one your eye lands on." : `Pick ${n === 3 ? "three" : "ten"} cards. Go with the ones your eye lands on.`;
  $("#pickSlots").innerHTML = Array.from({ length: n }, (_, i) => `<i>${i + 1}</i>`).join("");
  $("#fan").innerHTML = S.deck.map((c, i) => {
    const t = i / 77, y = Math.sin(t * Math.PI * 4) * 9 - Math.sin(t * Math.PI) * 14, a = Math.cos(t * Math.PI * 4) * 4 + (t - .5) * 10;
    return `<button class="fc" type="button" data-i="${i}" style="--y:${y.toFixed(1)}px;--a:${a.toFixed(1)}deg" aria-label="Face-down card ${i + 1} of 78"></button>`;
  }).join("");
  $("#parrotPick").disabled = false;
  requestAnimationFrame(() => { const w = $("#fanWrap"); w.scrollLeft = (w.scrollWidth - w.clientWidth) / 2; });
}
function takeCard(i) {
  const n = need();
  if (S.picks.length >= n || S.picks.includes(i)) return false;
  S.picks.push(i);
  const btn = $(`.fc[data-i="${i}"]`); if (btn) btn.classList.add("taken");
  const slot = $$("#pickSlots i")[S.picks.length - 1]; if (slot) slot.classList.add("on");
  if (S.picks.length === n) { $("#parrotPick").disabled = true; setTimeout(() => { buildReading(); go("read"); }, reduceMotion ? 150 : 750); }
  return true;
}
$("#fan").addEventListener("click", e => { const b = e.target.closest(".fc"); if (b) takeCard(+b.dataset.i); });
$("#parrotPick").addEventListener("click", () => {
  // The parrot pecks at cards using the same sealed shuffle stream.
  $("#parrotPick").disabled = true;
  const left = () => need() - S.picks.length;
  const step = () => {
    if (left() <= 0) return;
    let i; do { i = S.stream.int(78); } while (S.picks.includes(i));
    const b = $(`.fc[data-i="${i}"]`);
    if (b) { b.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" }); b.classList.add("peck"); }
    S.report.parrot = true;
    setTimeout(() => { takeCard(i); if (left() > 0) setTimeout(step, reduceMotion ? 60 : 260); }, reduceMotion ? 60 : 420);
  };
  step();
});

/* ---------- 5. reading ---------- */
function buildReading() {
  const r = { id: Date.now().toString(36), ts: new Date().toISOString(), spread: S.spread, question: S.question, bday: S.bday, reversals: S.reversals, cards: S.picks.map(i => ({ id: S.deck[i].id, rev: S.deck[i].rev })), report: Object.assign({}, S.report, { picks: S.picks.slice() }) };
  S.reading = r; S.saved = false;
  renderReading(r, false);
}
function slotHTML(r, c, i, revealed) {
  const sp = SPREADS[r.spread], pos = sp.positions[i], card = DECK[c.id];
  const label = revealed ? `${pos.t}: ${card.name}${c.rev ? ", reversed" : ""}` : `${pos.t}: face down. Tap to turn.`;
  let style = `--i:${i}`;
  if (r.spread === "celtic") { const [x, y] = CELTIC[i]; style += `;left:${(x * 100).toFixed(2)}%;top:${(y / 1.24 * 100).toFixed(2)}%`; }
  const cls = "slot" + (r.spread === "celtic" && i === 1 ? " cross" : "");
  return `<div class="${cls}" style="${style}"><button class="tcard${revealed ? " flipped" : ""}${c.rev ? " rev" : ""}" type="button" data-i="${i}" aria-label="${esc(label)}">${r.spread === "celtic" ? `<span class="badge">${i + 1}</span>` : ""}<span class="inner"><span class="back"></span><span class="face">${revealed ? ART.face(card) : ""}</span></span></button>${r.spread === "celtic" ? "" : `<span class="pos">${pos.t}</span>`}</div>`;
}
function noteHTML(r, c, i, revealed) {
  const pos = SPREADS[r.spread].positions[i], k = DECK[c.id];
  if (!revealed) return `<article class="panel note veiled" id="note-${i}"><span class="num">${i + 1}</span><div><p class="pos">${pos.t} · ${pos.d}</p><p class="wait">Tap card ${i + 1} to turn it over.</p></div></article>`;
  const A = analyzeQuestion(r.question), lens = lensFor(A.topic, k, c.rev);
  return `<article class="panel note" id="note-${i}"><span class="num">${i + 1}</span><div><p class="pos">${pos.t} · ${pos.d}</p><h3>${k.name}${c.rev ? '<span class="chip">Reversed</span>' : ""}</h3><p class="kw">${c.rev ? k.rv : k.up}</p><p>${c.rev ? k.rvM : k.upM}</p>${lens ? `<p class="lens"><b>For ${A.topic.label}:</b> ${lens}</p>` : ""}</div></article>`;
}
function renderReading(r, revealed) {
  const sp = SPREADS[r.spread], when = new Date(r.ts);
  const A = analyzeQuestion(r.question);
  $("#readMeta").textContent = `${sp.name}${A.topic ? " · " + A.topic.tag : ""} · ${dateOf(when)}`;
  $("#qEcho").textContent = r.question ? `“${r.question}”` : "An open reading";
  const el = $("#spread");
  el.className = "spread " + r.spread;
  el.innerHTML = r.cards.map((c, i) => slotHTML(r, c, i, revealed)).join("");
  $("#notes").innerHTML = r.cards.map((c, i) => noteHTML(r, c, i, revealed)).join("");
  $("#revealAll").parentElement.hidden = revealed;
  $("#after").hidden = !revealed;
  if (revealed) renderAfter(r);
}
function flip(i) {
  const r = S.reading, b = $(`.tcard[data-i="${i}"]`);
  if (!r || !b || b.dataset.turned) return;
  b.dataset.turned = "1";
  const c = r.cards[i], card = DECK[c.id], pos = SPREADS[r.spread].positions[i];
  b.querySelector(".face").innerHTML = ART.face(card);
  requestAnimationFrame(() => b.classList.add("flipped"));
  b.setAttribute("aria-label", `${pos.t}: ${card.name}${c.rev ? ", reversed" : ""}`);
  $("#note-" + i).outerHTML = noteHTML(r, c, i, true);
  if ($$(".tcard").every(t => t.dataset.turned)) setTimeout(finish, reduceMotion ? 0 : 700);
}
$("#spread").addEventListener("click", e => {
  const b = e.target.closest(".tcard"); if (!b) return;
  const i = +b.dataset.i;
  if (b.dataset.turned || b.classList.contains("flipped")) { const n = $("#note-" + i); if (n) n.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" }); return; }
  flip(i);
});
$("#revealAll").addEventListener("click", () => {
  const n = S.reading ? S.reading.cards.length : 0;
  for (let i = 0; i < n; i++) setTimeout(() => flip(i), reduceMotion ? 0 : i * 260);
});
function finish() {
  const r = S.reading; if (!r) return;
  $("#revealAll").parentElement.hidden = true;
  $("#after").hidden = false;
  if (!S.saved) { S.saved = true; r.savedOk = saveReading(r); }
  renderAfter(r);
}

const kw2 = s => { const p = s.split(" · "); return p.length > 1 ? `${p[0]} and ${p[1]}` : p[0]; };
function synth(r) {
  const cards = r.cards.map(c => Object.assign({}, DECK[c.id], { rev: c.rev }));
  const sp = SPREADS[r.spread], n = cards.length, out = [];
  const A = analyzeQuestion(r.question);
  const lead = [];
  if (A.topic) lead.push(`You asked about ${A.topic.label}, so every card here is read through that lens.`);
  if (A.type === "yesno") lead.push(yesNo(cards).text);
  if (A.type === "when") lead.push(whenText(cards));
  if (A.type === "how") { const adv = cards[n - 1]; lead.push(`For how to move forward, ${adv.name}${adv.rev ? " reversed" : ""} is your advice card: ${kw2(adv.rev ? adv.rv : adv.up)}.`); }
  if (A.type === "why" && n > 1) { const root = cards[r.spread === "celtic" ? 2 : 0]; lead.push(`For why this is happening, look at ${root.name}${root.rev ? " reversed" : ""} in the ${sp.positions[r.spread === "celtic" ? 2 : 0].t.replace(/^The /, "").toLowerCase()} position: ${kw2(root.rev ? root.rv : root.up)}.`); }
  if (lead.length) out.push(lead.join(" "));
  const majors = cards.filter(c => c.arcana === "major"), revs = cards.filter(c => c.rev);
  const counts = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
  cards.forEach(c => { if (c.suit) counts[c.suit]++; });
  if (n === 1) {
    const c = cards[0];
    out.push(`${c.name}${c.rev ? ", reversed," : ""} is your card. ${c.rev ? c.rvM : c.upM}`);
    if (c.arcana === "major") out.push("As one of the Major Arcana, it points to a bigger life lesson rather than a passing mood.");
    else out.push(`As a card of ${SUITS[c.suit].name}, it speaks to ${SUITS[c.suit].domain}.${c.rank <= 10 ? ` Its number carries the energy of ${RANK_THEME[c.rank]}.` : " Court cards often stand for a person, or a side of yourself you are being asked to step into."}`);
  } else {
    if (majors.length / n >= .5) out.push(`${majors.length} of your ${n} cards are Major Arcana. This is a significant chapter: bigger forces and life lessons are at work, more than day-to-day choices.`);
    else if (majors.length === 0) out.push("There are no Major Arcana here, so this is about everyday matters that are well within your power to shape.");
    else out.push(`${majors.map(c => c.name).join(" and ")} ${majors.length === 1 ? "marks" : "mark"} where the deeper lesson sits.`);
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (ranked[0][1] >= 2 && ranked[0][1] > ranked[1][1]) out.push(`${SUITS[ranked[0][0]].name} lead the spread, so ${SUITS[ranked[0][0]].domain} sit at the center of this.`);
    else if (n >= 10) { const miss = ranked.filter(x => x[1] === 0).map(x => x[0]); if (miss.length === 1) out.push(`No ${SUITS[miss[0]].name} appear, so ${SUITS[miss[0]].domain} are not where the answer lies right now.`); }
    if (revs.length / n > .5) out.push("More than half the cards are reversed. Energy is blocked, delayed or turned inward; the real work may be on the inside before anything shifts outside.");
    else if (revs.length === 0 && n >= 3 && r.reversals !== false) out.push("Every card came up upright, so energy is flowing outward and things can move freely.");
    const ranks = {};
    cards.forEach(c => { if (c.rank) ranks[c.rank] = (ranks[c.rank] || 0) + 1; });
    Object.entries(ranks).filter(([k, v]) => v >= 2 && +k <= 10).forEach(([k]) => out.push(`The ${RANK_PLURAL[k - 1]} repeat, underlining ${RANK_THEME[k]}.`));
    if (cards.filter(c => c.rank > 10).length >= 2) out.push("Several court cards suggest other people, or different sides of you, play a big part here.");
    const last = cards[n - 1], lp = sp.positions[n - 1].t.replace(/^The /, "").toLowerCase();
    out.push(`Your ${lp} card, ${last.name}${last.rev ? " reversed" : ""}, points toward ${kw2(last.rev ? last.rv : last.up)}.`);
  }
  if (A.person) {
    const courts = cards.filter(c => c.rank > 10);
    out.push(courts.length ? `${courts[0].name} may stand for ${A.person}, or for the side of you that is dealing with them.` : `No court cards appeared, so this reading is less about what ${A.person} will do and more about your own part in it.`);
  }
  if (A.topic && A.topic.key === "health") out.push("Tarot is for reflection, so for anything medical, check in with a doctor too.");
  const bc = birthCard(r.bday);
  if (bc && cards.some(c => c.id === bc.id)) out.push(`Your birth card, ${bc.name}, showed up in this reading. That makes its message especially personal.`);
  const m = r.report && r.report.moon;
  if (m) out.push(`You drew these cards under a ${moonName(m.name).toLowerCase()}, ${MOON_TEXT[m.idx]}.`);
  return out;
}
function parrotLine(r) {
  const A = analyzeQuestion(r.question);
  if (A.type === "yesno") return `A little birdie told me: ${yesNo(r.cards.map(c => Object.assign({}, DECK[c.id], { rev: c.rev }))).short}.`;
  const c = DECK[r.cards[r.cards.length - 1].id], rev = r.cards[r.cards.length - 1].rev;
  return `A little birdie told me: ${kw2(rev ? c.rv : c.up)}.`;
}
function entropyHTML(rep) {
  const when = new Date(rep.when), d = rep.dev || {}, kind = rep.kind || "phone", isPhone = kind === "phone";
  const phone = [d.screen ? `screen ${d.screen}` : "", d.battery != null ? `battery ${d.battery}%${d.charging ? " and charging" : ""}` : "", d.conn ? `${d.conn} connection` : "", "processor timing jitter"].filter(Boolean).join(", ");
  const rows = [
    [isPhone ? "Your touch" : "Your mouse", rep.touch ? `${fmt(rep.touch)} points along a ${fmt(rep.path)}-pixel swirl` : "Keyboard rhythm in place of a swirl"],
    isPhone ? ["Your phone's motion", rep.motion ? `${fmt(rep.motion)} readings from the motion sensors` : "Not available in this view, so it was left out"]
            : ["Your scrolling", rep.scroll ? `${fmt(rep.scroll)} scroll movements over the deck` : "None this time"],
    ["Your typing", rep.keys ? `The rhythm of ${fmt(rep.keys)} keystrokes` : "No question typed"],
    ["The moment", `${weekday(when)}, ${timeOf(when)} ${rep.tz || ""}, a day ruled by ${rep.ruler}`],
    ["The sky", `${moonName(rep.moon.name)}, ${Math.round(rep.moon.illum * 100)}% lit · Sun in ${rep.sun}`],
    ["Your question", rep.qLen ? `${fmt(rep.qLen)} characters` : "An open reading"],
    ["Your birthday", rep.bday ? "Included" : "Not given"],
    [isPhone ? "Your phone" : "Your computer", phone.charAt(0).toUpperCase() + phone.slice(1)],
    ["Your cut", rep.cut ? `The ${rep.cut.pile} pile of ${rep.cut.size} cards went on top` : "None"],
    ["Who picked", rep.parrot ? "The parrot pecked them from the spread" : "You chose from the spread"],
    ["Sealed with", `256 bits from your ${kind}'s secure random generator, all mixed together with SHA-256`]
  ];
  const fp = (rep.seed || "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  return `<summary>What shaped your shuffle</summary><dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl><p class="fp">Shuffle fingerprint <code>${fp}</code></p><p class="hint">All of this stayed on your ${kind}. Nothing was sent anywhere, and the same mix can never happen twice.</p>`;
}
function renderAfter(r) {
  $("#summary").innerHTML = `<h2>Your reading</h2>${synth(r).map(p => `<p>${esc(p)}</p>`).join("")}<p class="parrot-says">${esc(parrotLine(r))}</p>`;
  $("#entropy").innerHTML = entropyHTML(r.report);
  $("#savedLine").textContent = r.savedOk === false ? "This browser isn't keeping a journal, so this reading won't be saved." : "Saved to your journal on this device.";
}
function readingText(r) {
  const sp = SPREADS[r.spread];
  const lines = [`TarotParot · ${sp.name} · ${dateOf(new Date(r.ts))}`, r.question ? `Question: ${r.question}` : "An open reading", ""];
  const A = analyzeQuestion(r.question);
  r.cards.forEach((c, i) => { const k = DECK[c.id], lens = lensFor(A.topic, k, c.rev); lines.push(`${i + 1}. ${sp.positions[i].t}: ${k.name}${c.rev ? " (reversed)" : ""}`, `   ${c.rev ? k.rvM : k.upM}`); if (lens) lines.push(`   For ${A.topic.label}: ${lens}`); });
  lines.push("", ...synth(r), "", parrotLine(r));
  if (r.report && r.report.seed) lines.push("", `Shuffle fingerprint: ${r.report.seed.slice(0, 16)}`);
  return lines.join("\n");
}
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
$("#copyBtn").addEventListener("click", async () => {
  if (!S.reading) return;
  try { await navigator.clipboard.writeText(readingText(S.reading)); toast("Reading copied"); }
  catch (e) { toast("Copying isn't allowed here"); }
});

/* ---------- 6. journal ---------- */
const JKEY = "tp.journal.v1";
const journal = () => store.get(JKEY, []);
function saveReading(r) {
  const j = journal().filter(x => x.id !== r.id);
  const copy = Object.assign({}, r); delete copy.savedOk;
  j.unshift(copy); if (j.length > 200) j.length = 200;
  const ok = store.set(JKEY, j); updateJCount(); return ok;
}
function updateJCount() { const n = journal().length; $("#jcount").textContent = n ? String(n) : ""; }
function enterJournal() {
  const j = journal();
  if (!j.length) { $("#jlist").innerHTML = `<li class="panel empty"><p>Your finished readings will gather here, on this device only.</p><button class="btn primary" type="button" data-go="home">Start a reading</button></li>`; return; }
  $("#jlist").innerHTML = j.map(r => `<li class="panel jitem"><button class="jopen" type="button" data-id="${esc(r.id)}"><time datetime="${esc(r.ts)}">${esc(dateOf(new Date(r.ts)))} · ${esc(SPREADS[r.spread].name)}</time><b>${esc(r.question || "An open reading")}</b><span class="jcards">${esc(r.cards.map(c => DECK[c.id].name + (c.rev ? " (rev.)" : "")).join(", "))}</span></button><button class="jdel" type="button" data-id="${esc(r.id)}">Delete</button></li>`).join("");
}
$("#jlist").addEventListener("click", e => {
  const del = e.target.closest(".jdel");
  if (del) {
    if (!del.classList.contains("armed")) { del.classList.add("armed"); del.textContent = "Tap to delete"; setTimeout(() => { del.classList.remove("armed"); del.textContent = "Delete"; }, 3000); return; }
    store.set(JKEY, journal().filter(x => x.id !== del.dataset.id)); updateJCount(); enterJournal(); return;
  }
  const open = e.target.closest(".jopen");
  if (open) {
    const r = journal().find(x => x.id === open.dataset.id); if (!r) return;
    S.reading = r; S.saved = true; r.savedOk = true;
    $$(".view").forEach(v => v.classList.toggle("active", v.id === "v-read")); current = "read"; window.scrollTo(0, 0);
    renderReading(r, true);
  }
});

/* ---------- card back, logo, sky ---------- */
function rasterize(svg, w, h) {
  return new Promise(res => {
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const img = new Image();
    img.onload = () => { try { const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(img, 0, 0, w, h); res(c.toDataURL("image/png")); } catch (e) { res(url); } };
    img.onerror = () => res(null);
    img.src = url;
  });
}
rasterize(ART.back(), 360, 624).then(u => { if (u) document.documentElement.style.setProperty("--back", `url("${u}")`); });
$("#mark").innerHTML = ART.mark();

function startSky() {
  const cv = $("#sky");
  const gl = cv.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
  if (!gl) return;
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs = `precision mediump float;uniform vec2 r;uniform float t;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),mix(dot(h2(i+vec2(0.,1.)),f-vec2(0.,1.)),dot(h2(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r.y;float T=t*.05;
 vec2 q=vec2(fbm(uv*1.1+vec2(0.,T)),fbm(uv*1.1+vec2(5.2,1.3)-vec2(T*.8,0.)));
 vec2 p=uv*1.45+2.4*q+vec2(T*.3,-T*.2);
 vec3 C[9];
 C[0]=vec3(.50,.15,.22);C[1]=vec3(.76,.38,.18);C[2]=vec3(.86,.66,.26);C[3]=vec3(.48,.54,.22);C[4]=vec3(.40,.58,.52);
 C[5]=vec3(.42,.56,.74);C[6]=vec3(.24,.30,.52);C[7]=vec3(.46,.28,.50);C[8]=vec3(.93,.85,.66);
 vec3 acc=vec3(0.);float tw=0.;
 for(int i=0;i<9;i++){
  float fi=float(i);
  float w=fbm(p+vec2(fi*3.17,fi*1.93)+vec2(sin(T+fi),cos(T*.8+fi))*.35);
  w=exp(13.*w-(i==8?2.5:0.));
  acc+=C[i]*w;tw+=w;}
 vec3 c=acc/tw;
 float g=n(uv*9.+q*4.);
 c*=.96+.06*g;
 float L=dot(c,vec3(.3,.59,.11));c=mix(vec3(L),c,1.3);
 vec2 v=gl_FragCoord.xy/r-.5;c*=1.-.32*dot(v,v);
 gl_FragColor=vec4(c,1.);}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const v = sh(gl.VERTEX_SHADER, vs), fr = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !fr) return;
  const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, fr); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
  const offset = Math.random() * 200, t0 = performance.now(), SCALE = .5;
  let last = -1e9;
  function draw(now) {
    const w = Math.max(2, Math.round(innerWidth * SCALE)), h = Math.max(2, Math.round(innerHeight * SCALE));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    gl.uniform2f(uR, w, h); gl.uniform1f(uT, offset + (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function frame(now) { if (!document.hidden && now - last > 33) { last = now; draw(now); } requestAnimationFrame(frame); }
  if (reduceMotion) { draw(performance.now()); addEventListener("resize", () => draw(performance.now())); }
  else requestAnimationFrame(frame);
}
startSky();

/* ---------- home screen install ---------- */
let deferredPrompt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; $("#installBtn").hidden = false; });
$("#installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  try { await deferredPrompt.userChoice; } catch (e) { /* ignore */ }
  deferredPrompt = null; $("#installBtn").hidden = true;
});
const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone && !inFrame) $("#iosHint").hidden = false;
if (!inFrame) { try { if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) { /* not allowed here */ } }

$("#lede").textContent = COPY.lede;
$("#shuffleInstr").textContent = COPY.instr;
$("#lTouch").textContent = COPY.l1;
$("#lMotion").textContent = COPY.l2;
$("#installBtn").textContent = COPY.install;
updateJCount();
enterHome();
})();
