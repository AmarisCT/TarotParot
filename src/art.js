/* ===== Original card art for TarotParrot, drawn as SVG ===== */
const ART = (() => {
  const INK = "#4a2f17";
  const f = n => Math.round(n * 10) / 10;
  const P = a => a.map(p => f(p[0]) + "," + f(p[1])).join(" ");
  let N = 0;
  const ROMAN = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
  const TINT = { major:[.62,.40,.47], wands:[.80,.46,.24], cups:[.40,.52,.68], swords:[.50,.58,.62], pentacles:[.52,.54,.28] };
  const TINT2 = { major:[.85,.64,.30], wands:[.88,.60,.44], cups:[.48,.32,.52], swords:[.62,.68,.48], pentacles:[.84,.64,.30] };
  const FONT = "IM Fell English SC, Iowan Old Style, Georgia, serif";

  function gold(u) {
    return `<linearGradient id="g${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5620"/><stop offset=".3" stop-color="#ead08a"/><stop offset=".48" stop-color="#b88a3a"/><stop offset=".64" stop-color="#fbeab4"/><stop offset=".82" stop-color="#c19745"/><stop offset="1" stop-color="#6c4a1b"/></linearGradient>`;
  }
  function wash(id, seed, rgb, freq, gain = 2.2, bias = -.85) {
    return `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${freq} ${f(freq * 1.5 * 1000) / 1000}" numOctaves="4" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${gain} 0 0 0 ${bias}"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  }
  function grain(id, seed) {
    return `<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="${seed}"/><feColorMatrix type="matrix" values="0 0 0 0 .4 0 0 0 0 .28 0 0 0 0 .16 -.9 0 0 0 .5"/><feComposite in2="SourceAlpha" operator="in"/></filter>`;
  }
  function bleed(id, seed) {
    return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="${seed}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="30" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="4"/></filter>`;
  }
  const ctx = u => ({ u, G: `url(#g${u})`, S: `url(#s${u})`, B: `url(#b${u})` });

  /* ---------- drawing kit ---------- */
  function star8(c, x, y, R, r2, ri, fill) {
    const p = [];
    for (let i = 0; i < 16; i++) {
      const a = i * Math.PI / 8 - Math.PI / 2;
      const rr = i % 2 ? ri : (i % 4 === 0 ? R : r2);
      p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    return `<polygon points="${P(p)}" fill="${fill || c.G}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`;
  }
  function starN(c, x, y, R, ri, n, rot = 0, fill) {
    const p = [];
    for (let i = 0; i < n * 2; i++) {
      const a = i * Math.PI / n - Math.PI / 2 + rot;
      const rr = i % 2 ? ri : R;
      p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
    }
    return `<polygon points="${P(p)}" fill="${fill || c.G}" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>`;
  }
  const blob = (c, x, y, rx, ry, col, op = .55) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" opacity="${op}" filter="${c.B}"/>`;
  function sun(c, x, y, r, o = {}) {
    const n = o.n || 16, fill = o.fill || c.G;
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = i * 2 * Math.PI / n, R = r * (i % 2 ? (o.short || 1.5) : (o.long || 1.85)), w = Math.PI / n * .9;
      const b1 = [x + Math.cos(a - w) * r * .92, y + Math.sin(a - w) * r * .92];
      const b2 = [x + Math.cos(a + w) * r * .92, y + Math.sin(a + w) * r * .92];
      const tip = [x + Math.cos(a + .14) * R, y + Math.sin(a + .14) * R];
      const m = (r + R) / 2;
      const c1 = [x + Math.cos(a - .1) * m, y + Math.sin(a - .1) * m];
      const c2 = [x + Math.cos(a + w * .9) * m, y + Math.sin(a + w * .9) * m];
      s += `<path d="M${f(b1[0])} ${f(b1[1])}Q${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])}Q${f(c2[0])} ${f(c2[1])} ${f(b2[0])} ${f(b2[1])}Z" fill="${fill}" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>`;
    }
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="1"/>`;
    if (o.spiral !== false) {
      let d = "";
      for (let t = 0; t <= 4.2 * Math.PI; t += .25) { const rr = r * .06 + r * .055 * t; d += (t ? "L" : "M") + f(x + Math.cos(t) * rr) + " " + f(y + Math.sin(t) * rr); }
      s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(Math.max(.8, r * .045))}" stroke-linecap="round"/>`;
    }
    return s;
  }
  function crescent(c, x, y, r, k = .72, fill) {
    return `<path d="M${x} ${y - r}A${r} ${r} 0 1 1 ${x} ${y + r}A${f(r * k)} ${r} 0 1 0 ${x} ${y - r}Z" fill="${fill || c.G}" stroke="${INK}" stroke-width="1"/>`;
  }
  function cup(c, x, y, s) { // y = rim
    const d = `M${f(x - s)} ${y}C${f(x - s)} ${f(y + s * .9)} ${f(x - s * .35)} ${f(y + s * 1.15)} ${f(x - s * .12)} ${f(y + s * 1.2)}L${f(x - s * .1)} ${f(y + s * 1.6)}C${f(x - s * .12)} ${f(y + s * 1.78)} ${f(x - s * .5)} ${f(y + s * 1.82)} ${f(x - s * .55)} ${f(y + s * 1.98)}L${f(x + s * .55)} ${f(y + s * 1.98)}C${f(x + s * .5)} ${f(y + s * 1.82)} ${f(x + s * .12)} ${f(y + s * 1.78)} ${f(x + s * .1)} ${f(y + s * 1.6)}L${f(x + s * .12)} ${f(y + s * 1.2)}C${f(x + s * .35)} ${f(y + s * 1.15)} ${f(x + s)} ${f(y + s * .9)} ${f(x + s)} ${y}Z`;
    return `<path d="${d}" fill="${c.G}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y}" rx="${s}" ry="${f(s * .2)}" fill="#6e4a22" stroke="${INK}" stroke-width="1.2"/><ellipse cx="${x}" cy="${f(y + s * 1.4)}" rx="${f(s * .18)}" ry="${f(s * .08)}" fill="${c.G}" stroke="${INK}" stroke-width=".8"/>`;
  }
  function wand(c, x, y, L, ang = 0, w = 12) {
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">`;
    s += `<rect x="${-w / 2}" y="${-L / 2}" width="${w}" height="${L}" rx="${w / 2}" fill="#8b5a2e" stroke="${INK}" stroke-width="1"/>`;
    s += `<rect x="${f(-w / 2 + w * .18)}" y="${f(-L / 2 + 4)}" width="${f(w * .26)}" height="${L - 8}" rx="2" fill="#c08a58" opacity=".7"/>`;
    for (const k of [-.3, .06, .36]) s += `<rect x="${-w / 2 - 1}" y="${f(L * k)}" width="${w + 2}" height="${f(Math.max(2, w * .3))}" fill="${c.G}" stroke="${INK}" stroke-width=".5"/>`;
    for (const [k, sd] of [[-.4, 1], [-.14, -1], [.2, 1]]) {
      const lx = sd * (w / 2 + w * .45), ly = f(L * k);
      s += `<ellipse cx="${f(lx)}" cy="${ly}" rx="${f(w * .62)}" ry="${f(w * .28)}" transform="rotate(${sd * -35} ${f(lx)} ${ly})" fill="#7f8f4a" stroke="${INK}" stroke-width=".5"/>`;
    }
    s += `<circle cx="0" cy="${-L / 2}" r="${f(w * .45)}" fill="${c.G}" stroke="${INK}" stroke-width=".6"/>`;
    return s + "</g>";
  }
  function sword(c, x, y, L, ang = 0, w = 14) {
    const gy = -L / 2 + L * .72;
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">`;
    s += `<path d="M0 ${f(-L / 2)}L${w / 2} ${f(-L / 2 + w * 1.3)}L${w / 2} ${f(gy)}L${-w / 2} ${f(gy)}L${-w / 2} ${f(-L / 2 + w * 1.3)}Z" fill="${c.S}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`;
    s += `<line x1="0" y1="${f(-L / 2 + w * 1.6)}" x2="0" y2="${f(gy - 4)}" stroke="#7b8590" stroke-width="1"/>`;
    s += `<rect x="${f(-w * 1.9)}" y="${f(gy)}" width="${f(w * 3.8)}" height="${f(w * .55)}" rx="${f(w * .27)}" fill="${c.G}" stroke="${INK}" stroke-width="1"/>`;
    s += `<rect x="${f(-w * .32)}" y="${f(gy + w * .55)}" width="${f(w * .64)}" height="${f(L / 2 - gy - w * 1.05)}" fill="#5a3a22" stroke="${INK}" stroke-width=".8"/>`;
    s += `<circle cx="0" cy="${f(L / 2 - w * .45)}" r="${f(w * .5)}" fill="${c.G}" stroke="${INK}" stroke-width="1"/>`;
    return s + "</g>";
  }
  function pentacle(c, x, y, r) {
    const p = [];
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; p.push([x + Math.cos(a) * r * .68, y + Math.sin(a) * r * .68]); }
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.G}" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${f(r * .8)}" fill="none" stroke="${INK}" stroke-width=".9"/><polygon points="${P(p)}" fill="none" stroke="${INK}" stroke-width="${f(Math.max(1, r * .05))}" stroke-linejoin="round"/>`;
  }
  function rose(c, x, y, r, col = "#f6efe2") {
    let s = "";
    for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 - Math.PI / 2; s += `<circle cx="${f(x + Math.cos(a) * r * .5)}" cy="${f(y + Math.sin(a) * r * .5)}" r="${f(r * .55)}" fill="${col}" stroke="${INK}" stroke-width=".8"/>`; }
    s += `<circle cx="${x}" cy="${y}" r="${f(r * .45)}" fill="${col}" stroke="${INK}" stroke-width=".8"/>`;
    let d = "";
    for (let t = 0; t <= 3.4 * Math.PI; t += .3) { const rr = r * .05 + r * .03 * t; d += (t ? "L" : "M") + f(x + Math.cos(t) * rr) + " " + f(y + Math.sin(t) * rr); }
    return s + `<path d="${d}" fill="none" stroke="${INK}" stroke-width=".8"/>`;
  }
  function lemn(c, x, y, w, col) {
    const h = w * .28;
    const d = `M${x} ${y}C${f(x + w * .2)} ${f(y - h)} ${f(x + w * .5)} ${f(y - h)} ${f(x + w * .5)} ${y}C${f(x + w * .5)} ${f(y + h)} ${f(x + w * .2)} ${f(y + h)} ${x} ${y}C${f(x - w * .2)} ${f(y - h)} ${f(x - w * .5)} ${f(y - h)} ${f(x - w * .5)} ${y}C${f(x - w * .5)} ${f(y + h)} ${f(x - w * .2)} ${f(y + h)} ${x} ${y}Z`;
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(w * .075)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col || c.G}" stroke-width="${f(w * .048)}"/>`;
  }
  function heart(x, y, s, fill) {
    return `<path d="M${x} ${f(y + s * .9)}C${f(x - s * 1.3)} ${f(y + s * .1)} ${f(x - s * .7)} ${f(y - s * .8)} ${x} ${f(y - s * .25)}C${f(x + s * .7)} ${f(y - s * .8)} ${f(x + s * 1.3)} ${f(y + s * .1)} ${x} ${f(y + s * .9)}Z" fill="${fill}" stroke="${INK}" stroke-width="1"/>`;
  }
  function tower(c, x, y, w, h, col = "#b9a68a") { // y = base
    let s = `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" fill="${col}" stroke="${INK}" stroke-width="1"/>`;
    const cw = w / 5;
    for (let i = 0; i < 3; i++) s += `<rect x="${f(x - w / 2 + i * 2 * cw)}" y="${f(y - h - cw)}" width="${f(cw)}" height="${f(cw)}" fill="${col}" stroke="${INK}" stroke-width="1"/>`;
    return s + `<rect x="${f(x - w * .12)}" y="${f(y - h * .62)}" width="${f(w * .24)}" height="${f(h * .16)}" rx="${f(w * .12)}" fill="#3a2a22"/>`;
  }
  function crown(c, x, y, w, n = 5) { // y = band bottom
    const h = w * .55, p = [[x - w / 2, y]];
    for (let i = 0; i < n; i++) {
      const tx = x - w / 2 + i * w / (n - 1);
      p.push([tx, y - h]);
      if (i < n - 1) p.push([tx + w / (n - 1) / 2, y - h * .45]);
    }
    p.push([x + w / 2, y]);
    let s = `<polygon points="${P(p)}" fill="${c.G}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`;
    s += `<rect x="${f(x - w / 2)}" y="${f(y - h * .22)}" width="${w}" height="${f(h * .22)}" fill="${c.G}" stroke="${INK}" stroke-width="1"/>`;
    for (let i = 0; i < n; i++) s += `<circle cx="${f(x - w / 2 + i * w / (n - 1))}" cy="${f(y - h)}" r="${f(w * .05)}" fill="#b8574f" stroke="${INK}" stroke-width=".6"/>`;
    return s;
  }
  function key(c, x, y, L, ang) {
    const r = L * .13;
    let s = `<g transform="translate(${x} ${y}) rotate(${ang})">`;
    s += `<rect x="-2.5" y="${f(-L / 2 + r * 1.6)}" width="5" height="${f(L - r * 1.6)}" fill="${c.G}" stroke="${INK}" stroke-width=".7"/>`;
    s += `<rect x="2" y="${f(L / 2 - 14)}" width="10" height="5" fill="${c.G}" stroke="${INK}" stroke-width=".6"/><rect x="2" y="${f(L / 2 - 6)}" width="7" height="5" fill="${c.G}" stroke="${INK}" stroke-width=".6"/>`;
    s += `<circle cx="0" cy="${f(-L / 2 + r)}" r="${f(r)}" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="${f(-L / 2 + r)}" r="${f(r)}" fill="none" stroke="${c.G}" stroke-width="4"/>`;
    return s + "</g>";
  }
  function wings(c, x, y, w) {
    const d = `M${x} ${y}C${f(x - w * .3)} ${f(y - w * .35)} ${f(x - w * .8)} ${f(y - w * .4)} ${f(x - w)} ${f(y - w * .15)}C${f(x - w * .8)} ${f(y - w * .1)} ${f(x - w * .75)} ${y} ${f(x - w * .85)} ${f(y + w * .08)}C${f(x - w * .6)} ${f(y + w * .05)} ${f(x - w * .5)} ${f(y + w * .12)} ${f(x - w * .55)} ${f(y + w * .2)}C${f(x - w * .35)} ${f(y + w * .15)} ${f(x - w * .15)} ${f(y + w * .12)} ${x} ${y}Z`;
    const p = `<path d="${d}" fill="#efe3c8" stroke="${INK}" stroke-width="1"/>`;
    return p + `<g transform="translate(${2 * x} 0) scale(-1 1)">${p}</g>`;
  }
  function wheel(c, x, y, r) {
    let s = `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="${f(r * .14)}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c.G}" stroke-width="${f(r * .1)}"/>`;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<line x1="${f(x + Math.cos(a) * r * .3)}" y1="${f(y + Math.sin(a) * r * .3)}" x2="${f(x + Math.cos(a) * r * .95)}" y2="${f(y + Math.sin(a) * r * .95)}" stroke="${INK}" stroke-width="${f(r * .085)}"/><line x1="${f(x + Math.cos(a) * r * .3)}" y1="${f(y + Math.sin(a) * r * .3)}" x2="${f(x + Math.cos(a) * r * .95)}" y2="${f(y + Math.sin(a) * r * .95)}" stroke="${c.G}" stroke-width="${f(r * .05)}"/>`; }
    return s + `<circle cx="${x}" cy="${y}" r="${f(r * .3)}" fill="${c.G}" stroke="${INK}" stroke-width="1"/>`;
  }
  function drop(x, y, s, col = "#e8a24a") {
    return `<path d="M${x} ${f(y - s)}C${f(x + s * .6)} ${f(y - s * .1)} ${f(x + s * .6)} ${f(y + s * .6)} ${x} ${f(y + s * .6)}C${f(x - s * .6)} ${f(y + s * .6)} ${f(x - s * .6)} ${f(y - s * .1)} ${x} ${f(y - s)}Z" fill="${col}" stroke="${INK}" stroke-width=".6"/>`;
  }
  function feather(c, x, y, L, ang, col = "#f3ead6") {
    return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M0 ${f(-L / 2)}C${f(L * .22)} ${f(-L * .25)} ${f(L * .2)} ${f(L * .2)} 0 ${f(L / 2)}C${f(-L * .2)} ${f(L * .2)} ${f(-L * .22)} ${f(-L * .25)} 0 ${f(-L / 2)}Z" fill="${col}" stroke="${INK}" stroke-width="1"/><line x1="0" y1="${f(-L / 2 + 4)}" x2="0" y2="${f(L / 2 + 12)}" stroke="${INK}" stroke-width="1.2"/></g>`;
  }
  function wood(x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${f(Math.min(w, h) / 2)}" fill="#7d5230" stroke="${INK}" stroke-width="1"/>`;
  }

  /* ---------- the parrot (TarotParrot's mascot), feet at 0,0, facing left ---------- */
  function parrot(c, x, y, s = 1, o = {}) {
    const sil = o.silhouette, G = c.G;
    const fill = col => sil ? G : col;
    const sw = sil ? .8 / s : 1.2;
    let t = `<g transform="translate(${f(x)} ${f(y)}) scale(${s}${o.flipY ? " " + -s : ""})">`;
    if (!o.noTail) t += parrotTail(c, o);
    t += `<path d="M-32 -140C-50 -100 -40 -40 -6 -8C22 -20 34 -80 20 -138C10 -150 -20 -150 -32 -140Z" fill="${fill("#8d9c5c")}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) t += `<ellipse cx="-18" cy="-82" rx="15" ry="40" fill="#d9a441" opacity=".45"/>`;
    t += `<path d="M8 -136C46 -118 50 -50 22 4C10 -20 0 -80 8 -136Z" fill="${fill("#6f84a0")}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) t += `<path d="M14 -108C30 -96 34 -70 28 -48M16 -80C26 -70 28 -50 22 -30M12 -54C18 -44 18 -30 16 -18" fill="none" stroke="#3f4f68" stroke-width="1.1" stroke-linecap="round"/><path d="M22 -6C26 -14 30 -22 30 -30" stroke="#a5552c" stroke-width="3" stroke-linecap="round"/>`;
    t += `<circle cx="-12" cy="-160" r="28" fill="${fill("#d7a542")}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) t += `<path d="M-30 -182C-24 -194 -10 -196 -2 -188C-12 -190 -22 -186 -30 -182Z" fill="#a5552c"/><ellipse cx="-22" cy="-158" rx="11" ry="13" fill="#efe3c8"/>`;
    t += `<path d="M-34 -174C-52 -176 -64 -160 -58 -136C-56 -146 -48 -150 -36 -148Z" fill="${fill("#ece2cc")}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    t += `<path d="M-36 -148C-44 -146 -48 -138 -42 -132C-38 -136 -34 -140 -30 -144Z" fill="${fill("#3b2a22")}" stroke="${INK}" stroke-width="${sw}"/>`;
    if (!sil) t += `<circle cx="-22" cy="-163" r="4.2" fill="#24150f"/><circle cx="-23.4" cy="-164.6" r="1.3" fill="#fff8e6"/><path d="M-30 -158C-28 -150 -18 -148 -14 -154" fill="none" stroke="#c7b79a" stroke-width=".9"/>`;
    t += `<path d="M-22 -6Q-14 6 -4 -2M-4 -4Q4 8 12 0" fill="none" stroke="${sil ? INK : "#6b5a4a"}" stroke-width="3.2" stroke-linecap="round"/>`;
    return t + "</g>";
  }
  function parrotTail(c, o = {}) {
    const sil = o.silhouette;
    return `<path d="M2 -8C12 30 20 62 30 104C24 64 10 30 -8 -4Z" fill="${sil ? c.G : "#a5552c"}" stroke="${INK}" stroke-width="1"/><path d="M12 -12C28 22 40 56 50 92C38 54 24 20 4 -8Z" fill="${sil ? c.G : "#5f7392"}" stroke="${INK}" stroke-width="1"/>`;
  }

  /* ---------- Major Arcana emblems (art area roughly x 30–270, y 85–420) ---------- */
  const MAJOR = [
    c => blob(c,150,200,95,70,"#a9bcd0",.5) + blob(c,120,375,95,40,"#9fae86",.55) + sun(c,212,140,22) + star8(c,92,150,20,11,4)
      + `<path d="M28 420L28 374Q100 352 176 362Q200 366 214 382L222 420Z" fill="#8a7a4e" stroke="${INK}"/>`
      + `<path d="M150 352Q146 316 150 282" stroke="#5f6b33" stroke-width="3" fill="none"/><ellipse cx="139" cy="318" rx="10" ry="4" transform="rotate(30 139 318)" fill="#7f8f4a" stroke="${INK}" stroke-width=".5"/><ellipse cx="161" cy="304" rx="10" ry="4" transform="rotate(-30 161 304)" fill="#7f8f4a" stroke="${INK}" stroke-width=".5"/>`
      + rose(c,150,266,24) + feather(c,92,248,56,-28),
    c => blob(c,150,250,90,120,"#c9806a",.45) + lemn(c,150,118,96) + wand(c,150,245,170,0,11)
      + cup(c,72,352,14) + wand(c,120,368,52,0,6) + sword(c,178,366,58,0,7) + pentacle(c,228,368,16),
    c => blob(c,150,250,82,135,"#7d8fb0",.5)
      + `<rect x="96" y="120" width="108" height="214" fill="#8a4b52" opacity=".38"/>`
      + [0,1,2,3].map(r => [0,1,2].map(k => `<circle cx="${118 + k * 32}" cy="${148 + r * 50}" r="8" fill="#b8574f" stroke="${INK}" stroke-width=".6"/>`).join("")).join("")
      + `<rect x="50" y="110" width="36" height="294" fill="#3b2a2c" stroke="${INK}"/><rect x="44" y="102" width="48" height="12" fill="${c.G}" stroke="${INK}"/><text x="68" y="150" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#efe6d2">B</text>`
      + `<rect x="214" y="110" width="36" height="294" fill="#efe6d2" stroke="${INK}"/><rect x="208" y="102" width="48" height="12" fill="${c.G}" stroke="${INK}"/><text x="232" y="150" text-anchor="middle" font-family="${FONT}" font-size="24" fill="#3b2a2c">J</text>`
      + `<g transform="rotate(90 150 372)">${crescent(c,150,372,30,.55)}</g>`,
    c => blob(c,150,265,95,120,"#9fae86",.5)
      + Array.from({length:12}, (_, i) => { const a = (-160 + i * 140 / 11) * Math.PI / 180; return star8(c, 150 + Math.cos(a) * 100, 222 + Math.sin(a) * 100, 9, 5, 2); }).join("")
      + heart(150,262,58,c.G) + `<circle cx="150" cy="250" r="14" fill="none" stroke="${INK}" stroke-width="3"/><path d="M150 264V292M139 280H161" stroke="${INK}" stroke-width="3"/>`
      + [[78,1],[222,-1]].map(([x, sd]) => `<path d="M${x} 410Q${x + sd * 4} 360 ${x + sd * 10} 318" stroke="#9c8240" stroke-width="2.5" fill="none"/>` + [0,1,2,3,4].map(k => `<ellipse cx="${x + sd * (8 + k * 1.2)}" cy="${330 + k * 14}" rx="4" ry="8" fill="${c.G}" stroke="${INK}" stroke-width=".5"/>`).join("")).join(""),
    c => blob(c,150,262,100,122,"#c9806a",.5)
      + `<rect x="92" y="172" width="116" height="222" rx="4" fill="#9c9488" stroke="${INK}"/><rect x="104" y="186" width="92" height="196" rx="3" fill="#b9b1a3" stroke="${INK}" stroke-width=".8"/>`
      + [[92,1],[208,-1]].map(([x, sd]) => { let d = ""; for (let t = 0; t <= 3.6 * Math.PI; t += .3) { const rr = 3 + 2.6 * t; d += (t ? "L" : "M") + f(x + sd * Math.cos(t) * rr) + " " + f(172 + Math.sin(t) * rr); } return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="6"/><path d="${d}" fill="none" stroke="${c.G}" stroke-width="3.6"/>`; }).join("")
      + `<ellipse cx="150" cy="236" rx="17" ry="23" fill="none" stroke="${INK}" stroke-width="9"/><ellipse cx="150" cy="236" rx="17" ry="23" fill="none" stroke="${c.G}" stroke-width="6"/><rect x="122" y="258" width="56" height="10" fill="${c.G}" stroke="${INK}"/><rect x="145" y="258" width="10" height="110" fill="${c.G}" stroke="${INK}"/>`
      + star8(c,150,122,16,9,3),
    c => blob(c,150,240,95,122,"#d6a85a",.45)
      + `<rect x="146" y="118" width="8" height="250" fill="${c.G}" stroke="${INK}"/><rect x="132" y="134" width="36" height="8" fill="${c.G}" stroke="${INK}"/><rect x="124" y="154" width="52" height="8" fill="${c.G}" stroke="${INK}"/><rect x="116" y="174" width="68" height="8" fill="${c.G}" stroke="${INK}"/>`
      + key(c,124,350,96,-32) + key(c,176,350,96,32),
    c => blob(c,150,150,92,62,"#d6a85a",.45) + blob(c,150,312,100,72,"#c9806a",.45)
      + wings(c,150,150,72) + sun(c,150,140,22)
      + [128,172].map(x => `<circle cx="${x}" cy="304" r="40" fill="none" stroke="${INK}" stroke-width="9"/>`).join("") + [128,172].map(x => `<circle cx="${x}" cy="304" r="40" fill="none" stroke="${c.G}" stroke-width="6"/>`).join("")
      + heart(150,232,14,"#b8574f"),
    c => blob(c,150,245,95,130,"#7d8fb0",.45)
      + `<rect x="58" y="104" width="184" height="28" fill="#33415e" stroke="${INK}"/>` + [80,115,150,185,220].map(x => star8(c,x,118,8,5,2)).join("")
      + wings(c,150,196,62) + `<circle cx="150" cy="196" r="15" fill="${c.G}" stroke="${INK}"/>` + wheel(c,150,302,58)
      + `<circle cx="96" cy="392" r="17" fill="#2f2629" stroke="${c.G}" stroke-width="2"/><circle cx="204" cy="392" r="17" fill="#efe6d2" stroke="${c.G}" stroke-width="2"/>`,
    c => blob(c,150,272,100,110,"#d6a85a",.5) + lemn(c,150,118,96)
      + sun(c,150,276,42,{n:22,fill:"#b0623a",spiral:false,long:1.75,short:1.45})
      + Array.from({length:12}, (_, i) => { const a = i * Math.PI / 6; return rose(c, 150 + Math.cos(a) * 94, 276 + Math.sin(a) * 94, 8, "#f0b7a4"); }).join("")
      + heart(150,274,24,"#b8574f"),
    c => blob(c,150,245,100,140,"#33415e",.55) + [[70,120],[232,150],[60,300],[240,330]].map(([x, y]) => star8(c,x,y,7,4,1.6)).join("")
      + wood(212,118,10,300)
      + `<circle cx="150" cy="166" r="9" fill="none" stroke="${INK}" stroke-width="4.5"/><circle cx="150" cy="166" r="9" fill="none" stroke="${c.G}" stroke-width="2.6"/>`
      + `<path d="M126 197L174 197L162 175L138 175Z" fill="${c.G}" stroke="${INK}"/>` + blob(c,150,236,40,46,"#ffe7a3",.9)
      + `<rect x="126" y="197" width="48" height="80" fill="#f6d27a" fill-opacity=".55" stroke="${c.G}" stroke-width="3"/>` + starN(c,150,237,20,11,6,0,"#fff6d8")
      + `<rect x="120" y="277" width="60" height="11" fill="${c.G}" stroke="${INK}"/>`,
    c => blob(c,150,252,110,110,"#d6a85a",.45) + blob(c,150,252,70,70,"#a9bcd0",.4)
      + wheel(c,150,252,96) + `<circle cx="150" cy="252" r="70" fill="none" stroke="${INK}" stroke-width="1" stroke-dasharray="3 5"/>`
      + [[62,108],[238,108],[62,398],[238,398]].map(([x, y]) => star8(c,x,y,13,7,3)).join(""),
    c => blob(c,150,252,100,124,"#c9806a",.45)
      + sword(c,150,262,300,0,15)
      + `<rect x="66" y="176" width="168" height="7" fill="${c.G}" stroke="${INK}"/><path d="M78 182L56 240M78 182L100 240M222 182L200 240M222 182L244 240" stroke="${INK}" stroke-width="1.2"/>`
      + `<path d="M52 240A26 26 0 0 0 104 240Z" fill="${c.G}" stroke="${INK}"/><path d="M196 240A26 26 0 0 0 248 240Z" fill="${c.G}" stroke="${INK}"/>`,
    c => blob(c,150,300,90,100,"#7d8fb0",.45)
      + wood(143,110,14,176) + wood(86,104,128,14)
      + [[110,103,-30],[190,103,30],[136,160,-40],[164,220,40]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4" transform="rotate(${a} ${x} ${y})" fill="#7f8f4a" stroke="${INK}" stroke-width=".5"/>`).join("")
      + `<path d="M150 286V308" stroke="${INK}" stroke-width="2"/>` + sun(c,150,346,30,{n:24,long:1.55,short:1.3,spiral:false}) + `<circle cx="150" cy="346" r="18" fill="#fff4cf" stroke="${INK}" stroke-width=".8"/>`,
    c => blob(c,150,230,100,140,"#7e4a5e",.5)
      + `<path d="M96 108V312" stroke="#5a3a22" stroke-width="5"/><rect x="98" y="118" width="108" height="126" fill="#2b1c1f" stroke="${c.G}" stroke-width="2"/>` + rose(c,152,182,28)
      + sun(c,150,362,36,{spiral:false}) + `<rect x="26" y="362" width="248" height="60" fill="#5f6b48" stroke="${INK}"/>`
      + tower(c,68,362,28,74) + tower(c,232,362,28,74),
    c => blob(c,150,250,100,122,"#a9bcd0",.5)
      + `<g transform="rotate(-24 98 202)">${cup(c,98,180,22)}</g>` + cup(c,202,284,22)
      + `<path d="M118 188Q166 196 194 284" stroke="#6f8fb5" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M118 188Q166 196 194 284" stroke="#d8e6f2" stroke-width="2" fill="none" stroke-linecap="round"/>`
      + `<rect x="126" y="350" width="48" height="48" fill="none" stroke="${INK}" stroke-width="5"/><rect x="126" y="350" width="48" height="48" fill="none" stroke="${c.G}" stroke-width="3"/><polygon points="150,357 169,391 131,391" fill="${c.G}" stroke="${INK}"/>`,
    c => blob(c,150,240,100,140,"#3b2a2c",.6)
      + (() => { const p = []; for (let i = 0; i < 5; i++) { const a = Math.PI / 2 + i * 4 * Math.PI / 5; p.push([150 + Math.cos(a) * 34, 142 + Math.sin(a) * 34]); } return `<circle cx="150" cy="142" r="38" fill="none" stroke="${c.G}" stroke-width="2.5"/><polygon points="${P(p)}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><polygon points="${P(p)}" fill="none" stroke="${c.G}" stroke-width="3" stroke-linejoin="round"/>`; })()
      + `<path d="M122 214C96 200 84 172 92 142C102 168 114 182 136 198Z" fill="${c.G}" stroke="${INK}"/><path d="M178 214C204 200 216 172 208 142C198 168 186 182 164 198Z" fill="${c.G}" stroke="${INK}"/>`
      + `<rect x="112" y="252" width="76" height="58" fill="#4a3a36" stroke="${c.G}" stroke-width="2"/>`
      + [[-1],[1]].map(([sd]) => Array.from({length:6}, (_, k) => { const x = 150 + sd * (28 + k * 13), y = 310 + k * 17; return `<ellipse cx="${f(x)}" cy="${y}" rx="${k % 2 ? 4 : 8}" ry="${k % 2 ? 8 : 4}" fill="none" stroke="${INK}" stroke-width="4"/><ellipse cx="${f(x)}" cy="${y}" rx="${k % 2 ? 4 : 8}" ry="${k % 2 ? 8 : 4}" fill="none" stroke="${c.G}" stroke-width="2.4"/>`; }).join("")).join(""),
    c => blob(c,150,240,100,140,"#7e4a5e",.55)
      + tower(c,150,410,74,218) + `<g transform="rotate(28 210 148)">${crown(c,210,160,52,5)}</g>`
      + `<polyline points="248,90 204,136 222,141 178,184 196,189 160,220" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><polyline points="248,90 204,136 222,141 178,184 196,189 160,220" fill="none" stroke="${c.G}" stroke-width="6" stroke-linejoin="round"/>`
      + [[78,200],[66,262],[230,250],[88,320],[222,318],[240,380],[60,372]].map(([x, y]) => drop(x,y,9)).join(""),
    c => blob(c,150,200,100,112,"#33415e",.55) + blob(c,150,386,104,32,"#6f8fb5",.6)
      + star8(c,150,175,58,30,11)
      + [[64,110],[236,110],[48,192],[252,192],[68,268],[232,268],[150,266]].map(([x, y]) => star8(c,x,y,13,7,3)).join("")
      + `<g transform="rotate(-38 112 330)"><ellipse cx="112" cy="334" rx="16" ry="20" fill="#c98a5a" stroke="${INK}"/><rect x="104" y="304" width="16" height="14" fill="#c98a5a" stroke="${INK}"/></g>`
      + `<path d="M96 318Q90 350 120 382" stroke="#d8e6f2" stroke-width="3.5" fill="none"/><path d="M60 388Q80 380 100 388T140 388T180 388T220 388T250 388M70 402Q90 394 110 402T150 402T190 402T234 402" stroke="#d8e6f2" stroke-width="2" fill="none"/>`,
    c => blob(c,150,190,100,100,"#33415e",.6) + blob(c,150,404,98,22,"#6f8fb5",.65)
      + `<circle cx="150" cy="165" r="52" fill="#e9e4d6" stroke="${c.G}" stroke-width="3"/>` + crescent(c,150,165,52,.42)
      + drop(112,244,7,"#f0d48a") + drop(150,256,7,"#f0d48a") + drop(188,244,7,"#f0d48a")
      + tower(c,52,372,28,82) + tower(c,248,372,28,82)
      + `<path d="M150 410C120 384 186 352 150 324C126 304 166 286 150 268" stroke="#c99c50" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>`,
    c => blob(c,150,210,110,110,"#d6a85a",.55)
      + sun(c,150,200,52)
      + [72,124,176,228].map(x => `<path d="M${x} 420V388" stroke="#5f6b33" stroke-width="3"/>` + Array.from({length:10}, (_, k) => { const a = k * Math.PI / 5; return `<ellipse cx="${f(x + Math.cos(a) * 12)}" cy="${f(380 + Math.sin(a) * 12)}" rx="7" ry="3.4" transform="rotate(${f(a * 180 / Math.PI)} ${f(x + Math.cos(a) * 12)} ${f(380 + Math.sin(a) * 12)})" fill="#e8b23c" stroke="${INK}" stroke-width=".5"/>`; }).join("") + `<circle cx="${x}" cy="380" r="8" fill="#5a3a22" stroke="${INK}"/>`).join(""),
    c => blob(c,150,150,110,62,"#a9bcd0",.55)
      + [60,90,120,150,180,210,240].map(x => `<line x1="150" y1="130" x2="${x}" y2="404" stroke="${c.G}" stroke-width="1.5" opacity=".6"/>`).join("")
      + [[108,120,22],[138,108,27],[172,112,25],[202,124,20]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f3ede2" stroke="${INK}" stroke-width=".8"/>`).join("")
      + `<g transform="translate(110 274) rotate(-55)"><path d="M0 -22Q30 -6 62 -4L124 -3L124 3L62 4Q30 6 0 22Z" fill="${c.G}" stroke="${INK}"/><ellipse cx="0" cy="0" rx="5" ry="22" fill="#6e4a22" stroke="${INK}"/></g>`
      + `<rect x="114" y="206" width="40" height="40" fill="#f3ede2" stroke="${INK}"/><rect x="130" y="210" width="8" height="32" fill="#b8574f"/><rect x="118" y="222" width="32" height="8" fill="#b8574f"/>`
      + [[90,388],[150,398],[210,388]].map(([x, y]) => star8(c,x,y,14,8,3)).join(""),
    c => blob(c,150,255,100,130,"#9fae86",.55)
      + Array.from({length:36}, (_, i) => { const t = i / 36 * Math.PI * 2, x = 150 + 72 * Math.cos(t), y = 255 + 108 * Math.sin(t), a = Math.atan2(108 * Math.cos(t), -72 * Math.sin(t)) * 180 / Math.PI + (i % 2 ? 28 : -28); return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="10" ry="4.2" transform="rotate(${f(a)} ${f(x)} ${f(y)})" fill="${i % 2 ? "#6f7f3f" : "#8f9f55"}" stroke="${INK}" stroke-width=".4"/>`; }).join("")
      + lemn(c,150,147,44,"#b8574f") + lemn(c,150,363,44,"#b8574f") + star8(c,150,255,36,19,6)
      + [[58,106],[242,106],[58,402],[242,402]].map(([x, y]) => star8(c,x,y,13,7,3)).join("")
  ];

  /* ---------- Minor Arcana ---------- */
  const PIPS = {
    2:[[0,-1],[0,1]], 3:[[0,-1],[0,0],[0,1]], 4:[[-1,-1],[1,-1],[-1,1],[1,1]], 5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],
    6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]], 7:[[-1,-1],[1,-1],[0,-.5],[-1,0],[1,0],[-1,1],[1,1]],
    8:[[-1,-1],[1,-1],[0,-.5],[-1,0],[1,0],[0,.5],[-1,1],[1,1]],
    9:[[-1,-1.2],[1,-1.2],[-1,-.4],[1,-.4],[0,0],[-1,.4],[1,.4],[-1,1.2],[1,1.2]],
    10:[[-1,-1.2],[1,-1.2],[0,-.8],[-1,-.4],[1,-.4],[-1,.4],[1,.4],[0,.8],[-1,1.2],[1,1.2]]
  };
  const SUIT_BLOB = { wands:"#c9806a", cups:"#a9bcd0", swords:"#9fb0b8", pentacles:"#9fae86" };
  function minor(c, card) {
    const s = card.suit, r = card.rank;
    let o = blob(c,150,255,100,135,SUIT_BLOB[s],.45);
    if (r === 1) {
      o += Array.from({length:16}, (_, i) => { const a = i * Math.PI / 8; return `<line x1="${f(150 + Math.cos(a) * 70)}" y1="${f(255 + Math.sin(a) * 70)}" x2="${f(150 + Math.cos(a) * 122)}" y2="${f(255 + Math.sin(a) * 122)}" stroke="${c.G}" stroke-width="${i % 2 ? 1.2 : 2.4}" opacity=".75"/>`; }).join("");
      if (s === "cups") o += cup(c,150,192,60) + drop(130,150,7,"#a9c3dd") + drop(150,136,7,"#a9c3dd") + drop(170,150,7,"#a9c3dd");
      if (s === "wands") o += wand(c,150,258,300,0,18);
      if (s === "swords") o += sword(c,150,262,300,0,20) + crown(c,150,138,62,5);
      if (s === "pentacles") o += pentacle(c,150,255,78);
      return o;
    }
    if (r <= 10) {
      if (s === "wands" || s === "swords") {
        const spread = Math.min(44, 10 * (r - 1));
        for (let i = 0; i < r; i++) {
          const a = r === 1 ? 0 : -spread / 2 + i * spread / (r - 1), ar = a * Math.PI / 180;
          const x = 150 + Math.sin(ar) * 150, y = 440 - Math.cos(ar) * 150;
          o += s === "wands" ? wand(c,x,y,270,a,r > 6 ? 10 : 12) : sword(c,x,y,264,a,r > 6 ? 11 : 13);
        }
      } else {
        const sz = r <= 3 ? 34 : r <= 6 ? 30 : r <= 8 ? 26 : 22, yu = r >= 9 ? 100 : 100;
        for (const [px, py] of PIPS[r]) {
          const x = 150 + px * 56, y = 255 + py * yu;
          o += s === "cups" ? cup(c,x,y - sz * .85,sz * .85) : pentacle(c,x,y,sz * .9);
        }
      }
      return o;
    }
    // court cards: a symbol of rank above the suit
    if (r === 11) o += feather(c,150,148,74,24,"#f3ead6");
    if (r === 12) o += `<path d="M126 178A26 26 0 1 1 174 178" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M126 178A26 26 0 1 1 174 178" fill="none" stroke="${c.G}" stroke-width="10" stroke-linecap="round"/>` + [[128,162],[150,128],[172,162]].map(([x, y]) => `<circle cx="${x}" cy="${y + 4}" r="1.8" fill="${INK}"/>`).join("");
    if (r === 13) o += crown(c,150,178,78,5);
    if (r === 14) o += crown(c,150,178,80,3) + `<rect x="147" y="112" width="6" height="26" fill="${c.G}" stroke="${INK}"/><rect x="139" y="118" width="22" height="6" fill="${c.G}" stroke="${INK}"/>`;
    if (s === "cups") o += cup(c,150,258,42);
    if (s === "pentacles") o += pentacle(c,150,300,52);
    if (s === "wands") o += wand(c,150,304,220,0,14);
    if (s === "swords") o += sword(c,150,306,226,0,16);
    return o;
  }

  /* ---------- a card face ---------- */
  function face(card) {
    const u = "c" + (++N), c = ctx(u), seed = card.id * 7 + 3;
    const tint = TINT[card.suit || "major"];
    const top = card.arcana === "major" ? ROMAN[card.num] : (card.rank <= 10 ? (card.rank === 1 ? "ACE" : ROMAN[card.rank]) : RANKS[card.rank - 1]);
    const name = card.name, fs = f(Math.min(24, 232 / (name.length * .56)));
    const art = card.arcana === "major" ? MAJOR[card.num](c) : minor(c, card);
    return `<svg viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name}"><defs>${gold(u)}<linearGradient id="s${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7f8a96"/><stop offset=".5" stop-color="#eef1f3"/><stop offset="1" stop-color="#76818d"/></linearGradient><radialGradient id="v${u}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#6b3f1e" stop-opacity="0"/><stop offset="1" stop-color="#6b3f1e" stop-opacity=".4"/></radialGradient>${wash("w" + u, seed, tint, .006)}${wash("x" + u, seed + 31, TINT2[card.suit || "major"], .0045, 2, -.95)}${grain("n" + u, seed + 5)}${bleed("b" + u, seed + 9)}</defs>`
      + `<rect width="300" height="520" rx="16" fill="#efe2c2"/><rect width="300" height="520" rx="16" fill="#000" filter="url(#w${u})"/><rect width="300" height="520" rx="16" fill="#000" filter="url(#x${u})"/><rect width="300" height="520" rx="16" fill="#000" filter="url(#n${u})"/><rect width="300" height="520" rx="16" fill="url(#v${u})"/>`
      + `<rect x="16" y="16" width="268" height="488" rx="9" fill="none" stroke="${c.G}" stroke-width="3"/><rect x="23" y="23" width="254" height="474" rx="6" fill="none" stroke="${c.G}" stroke-width="1"/>`
      + [[23,23],[277,23],[23,497],[277,497]].map(([x, y]) => starN(c,x,y,8,2.5,4)).join("")
      + `<text x="150" y="64" text-anchor="middle" font-family="${FONT}" font-size="25" letter-spacing="2" fill="#5b3a1c">${top}</text>`
      + art
      + `<rect x="32" y="434" width="236" height="46" rx="4" fill="#f5ead1" fill-opacity=".9" stroke="${c.G}" stroke-width="1.6"/><text x="150" y="${f(457 + fs * .34)}" text-anchor="middle" font-family="${FONT}" font-size="${fs}" fill="#3b2414">${name}</text></svg>`;
  }

  /* ---------- the card back (looks the same either way up, so reversals stay hidden) ---------- */
  function back() {
    const u = "bk", c = ctx(u);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 520" width="300" height="520"><defs>${gold(u)}${wash("a" + u, 11, [.66,.34,.18], .007)}${wash("o" + u, 23, [.45,.45,.24], .005)}${wash("y" + u, 37, [.42,.5,.62], .006, 2, -.9)}${wash("r" + u, 53, [.86,.54,.44], .005, 2, -1)}${wash("p" + u, 71, [.46,.3,.52], .0055, 2, -.95)}${grain("n" + u, 4)}${bleed("b" + u, 8)}<radialGradient id="v${u}" cx=".5" cy=".5" r=".72"><stop offset=".5" stop-color="#1c0d14" stop-opacity="0"/><stop offset="1" stop-color="#1c0d14" stop-opacity=".55"/></radialGradient><radialGradient id="orb${u}" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#f4f4f1"/><stop offset=".55" stop-color="#b9c4d2"/><stop offset="1" stop-color="#6b7c97"/></radialGradient></defs>`
      + `<rect width="300" height="520" rx="16" fill="#4a2330"/><rect width="300" height="520" rx="16" filter="url(#a${u})"/><rect width="300" height="520" rx="16" filter="url(#o${u})"/><rect width="300" height="520" rx="16" filter="url(#y${u})"/><rect width="300" height="520" rx="16" filter="url(#r${u})"/><rect width="300" height="520" rx="16" filter="url(#p${u})"/><rect width="300" height="520" rx="16" filter="url(#n${u})"/><rect width="300" height="520" rx="16" fill="url(#v${u})"/>`
      + `<rect x="14" y="14" width="272" height="492" rx="10" fill="none" stroke="${c.G}" stroke-width="3"/><rect x="22" y="22" width="256" height="476" rx="7" fill="none" stroke="${c.G}" stroke-width="1"/>`
      + `<circle cx="150" cy="260" r="114" fill="none" stroke="${c.G}" stroke-width="1.4" stroke-dasharray="2 6"/><circle cx="150" cy="260" r="102" fill="none" stroke="${c.G}" stroke-width="2"/>`
      + `<circle cx="150" cy="260" r="60" fill="url(#orb${u})" stroke="${c.G}" stroke-width="2.5"/>` + blob(c,136,248,30,22,"#ffffff",.35)
      + star8(c,150,260,98,46,13)
      + parrot(c,150,98,.34,{silhouette:true,noTail:true}) + `<g transform="rotate(180 150 260)">${parrot(c,150,98,.34,{silhouette:true,noTail:true})}</g>`
      + [[46,46],[254,46],[46,474],[254,474],[46,260],[254,260]].map(([x, y]) => starN(c,x,y,11,3,4)).join("")
      + "</svg>";
  }

  /* ---------- app icon: the parrot perched on a crystal ball ---------- */
  function icon(size = 512) {
    const u = "ic", c = ctx(u);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}"><defs>${gold(u)}${wash("a" + u, 11, [.66,.34,.18], .005)}${wash("o" + u, 23, [.45,.45,.24], .004)}${wash("y" + u, 37, [.42,.5,.62], .0045, 2, -.9)}${bleed("b" + u, 8)}<radialGradient id="v${u}" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#1c0d14" stop-opacity="0"/><stop offset="1" stop-color="#1c0d14" stop-opacity=".55"/></radialGradient><radialGradient id="orb${u}" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="#f6f6f2"/><stop offset=".55" stop-color="#b9c4d2"/><stop offset="1" stop-color="#5f708c"/></radialGradient></defs>`
      + `<rect width="512" height="512" fill="#4a2330"/><rect width="512" height="512" filter="url(#a${u})"/><rect width="512" height="512" filter="url(#o${u})"/><rect width="512" height="512" filter="url(#y${u})"/><rect width="512" height="512" fill="url(#v${u})"/>`
      + star8(c,350,150,58,30,9)
      + `<path d="M196 430C200 404 214 392 256 392C298 392 312 404 316 430Z" fill="#5a3a22" stroke="${INK}" stroke-width="1.5"/><rect x="186" y="424" width="140" height="16" rx="5" fill="${c.G}" stroke="${INK}" stroke-width="1.5"/>`
      + `<circle cx="256" cy="330" r="86" fill="url(#orb${u})" stroke="${c.G}" stroke-width="4"/>` + blob(c,232,306,40,28,"#ffffff",.4)
      + parrot(c,250,250,.9)
      + "</svg>";
  }


  /* ---------- home-screen hero: the parrot on a living crystal ball ---------- */
  function hero() {
    const u = "hr", c = ctx(u);
    const sparkle = (x, y, r, d) => `<g class="sparkle" style="animation-delay:${d}s;transform-origin:${x}px ${y}px">${starN(c, x, y, r, r * .28, 4)}</g>`;
    return `<svg class="hero-svg" viewBox="40 20 440 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The TarotParrot parrot perched on a glowing crystal ball beside a gold star"><defs>${gold(u)}
<radialGradient id="orb${u}" cx=".4" cy=".36" r=".72"><stop offset="0" stop-color="#f7f6f2"/><stop offset=".5" stop-color="#c3cddb"/><stop offset="1" stop-color="#5f708c"/></radialGradient>
<radialGradient id="halo${u}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>
<clipPath id="clip${u}"><circle cx="256" cy="330" r="84"/></clipPath>
<filter id="soft${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<linearGradient id="sh${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<circle class="halo" cx="256" cy="330" r="150" fill="url(#halo${u})"/>
<g class="star-main" style="transform-origin:350px 150px">${star8(c, 350, 150, 58, 30, 9)}</g>
${sparkle(410, 238, 11, 0)}${sparkle(118, 186, 9, 1.3)}${sparkle(170, 92, 7, 2.6)}${sparkle(396, 64, 8, 3.4)}
<path d="M196 430C200 404 214 392 256 392C298 392 312 404 316 430Z" fill="#5a3a22" stroke="${INK}" stroke-width="1.5"/><rect x="186" y="424" width="140" height="16" rx="5" fill="${c.G}" stroke="${INK}" stroke-width="1.5"/>
<circle cx="256" cy="330" r="86" fill="url(#orb${u})"/>
<g clip-path="url(#clip${u})"><g class="swirl" style="transform-origin:256px 330px" filter="url(#soft${u})">
<ellipse cx="226" cy="300" rx="62" ry="30" fill="#e08c70" opacity=".6"/><ellipse cx="292" cy="346" rx="58" ry="28" fill="#6f93ae" opacity=".65"/><ellipse cx="250" cy="372" rx="50" ry="22" fill="#d9a843" opacity=".55"/><ellipse cx="280" cy="292" rx="34" ry="20" fill="#9a6fb0" opacity=".55"/>
</g><g class="shimmer"><rect x="150" y="240" width="60" height="190" fill="url(#sh${u})" transform="rotate(24 180 335)"/></g>
<ellipse cx="228" cy="296" rx="30" ry="18" fill="#fff" opacity=".45"/></g>
<circle cx="256" cy="330" r="86" fill="none" stroke="${c.G}" stroke-width="4"/>
<g class="bob">${parrot(c, 250, 250, .9)}</g>
</svg>`;
  }

  /* small logo mark for the header */
  function mark() {
    const u = "mk", c = ctx(u);
    return `<svg viewBox="-70 -205 130 215" width="26" height="42" aria-hidden="true"><defs>${gold(u)}</defs>${parrot(c,0,0,1)}</svg>`;
  }

  return { face, back, icon, mark, hero, ROMAN };
})();
