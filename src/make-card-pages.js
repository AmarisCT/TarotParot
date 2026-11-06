// Builds one static, search-friendly page per card, an index of all 78, and a sitemap.
// Run: node src/make-card-pages.js <outputDir>   (outputDir defaults to the folder above src/)
const fs = require("fs"), path = require("path");
const SRC = __dirname, OUT = path.resolve(process.argv[2] || path.join(SRC, ".."));
const SITE = "https://amarisct.github.io/TarotParrot/";
const code = ["deck.js", "question.js", "art.js"].map(f => fs.readFileSync(path.join(SRC, f), "utf8")).join("\n");
const { DECK, SUITS, RANKS, RANK_THEME, LENS, ART, MAJOR_EL } = new Function(code + "; return { DECK, SUITS, RANKS, RANK_THEME, LENS, ART, MAJOR_EL };")();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const slug = k => k.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const kw = s => s.split(" · ");
const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const TOPIC_LABEL = { love: "Love & relationships", career: "Work & career", money: "Money", health: "Health & energy", self: "Your path" };
const el = k => k.arcana === "major" ? MAJOR_EL[k.num] : SUITS[k.suit].element;
const about = k => k.arcana === "major"
  ? `${k.name} is card ${ART.ROMAN[k.num]} of the Major Arcana, the 22 cards that mark big life lessons and turning points. It is linked to the element of ${el(k)}.`
  : `The ${k.name} is ${k.rank <= 10 ? `the ${ORD[k.rank]} card` : `the ${RANKS[k.rank - 1]}`} in the suit of ${SUITS[k.suit].name}, the ${SUITS[k.suit].element.toLowerCase()} suit of ${SUITS[k.suit].domain}.${k.rank <= 10 ? ` Its number carries the energy of ${RANK_THEME[k.rank]}.` : " Court cards often stand for a person, or a side of yourself you are being asked to step into."}`;
const lens = (k, key) => { const L = LENS[key][k.arcana === "major" ? "major" : k.suit]; return L; };

const CSS = `:root{--wine:#4a2330;--parch:#f3e8cf;--gold:#d9b45e;--gold-hi:#f6e0a0;--glass:rgba(44,20,30,.62);--line:rgba(236,204,124,.36);--display:"IM Fell English",Georgia,serif;--sc:"IM Fell English SC",Georgia,serif;--body:"EB Garamond",Georgia,serif;color-scheme:dark}
*{box-sizing:border-box}html,body{margin:0}
body{font-family:var(--body);font-size:19px;line-height:1.55;color:var(--parch);background:#5a2f38;background-image:radial-gradient(60% 40% at 15% 10%,#b8603a 0,transparent 70%),radial-gradient(55% 40% at 90% 30%,#6f8db0 0,transparent 70%),radial-gradient(60% 45% at 20% 75%,#7f8a3c 0,transparent 70%),radial-gradient(55% 45% at 85% 90%,#7a2a35 0,transparent 70%),radial-gradient(40% 30% at 55% 50%,#75497e 0,transparent 70%);background-attachment:fixed;min-height:100vh}
main{max-width:860px;margin:0 auto;padding:18px max(16px,env(safe-area-inset-right)) 40px max(16px,env(safe-area-inset-left));display:flex;flex-direction:column;gap:20px}
a{color:var(--gold-hi)}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.brand{font-family:var(--display);font-size:26px;color:var(--gold-hi);text-decoration:none}
.crumbs{font-family:var(--sc);font-size:15px;letter-spacing:.04em}
h1,h2{font-family:var(--display);font-weight:400;margin:0;text-wrap:balance;text-shadow:0 2px 16px rgba(30,10,15,.7)}
h1{font-size:clamp(34px,7vw,52px);line-height:1.08}h2{font-size:28px;margin-bottom:8px}
.lede{margin:0;max-width:36em;text-shadow:0 1px 10px rgba(30,10,15,.8)}
.hero{display:grid;grid-template-columns:minmax(0,260px) 1fr;gap:26px;align-items:start}
.card{border-radius:12px;overflow:hidden;box-shadow:0 16px 40px rgba(10,4,6,.5)}.card svg{display:block;width:100%;height:auto}
.panel{background:var(--glass);border:1px solid var(--line);border-radius:16px;padding:20px;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.panel p{margin:0 0 10px;max-width:38em}.panel p:last-child{margin-bottom:0}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;padding:0;list-style:none}
.chips li{font-family:var(--sc);font-size:15px;letter-spacing:.03em;border:1px solid var(--line);border-radius:999px;padding:3px 12px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;padding:10px 8px;border-top:1px solid var(--line)}
th{font-family:var(--sc);font-weight:400;color:var(--gold-hi);font-size:16px;letter-spacing:.03em;width:24%}
thead th{border-top:0}
.cta{display:inline-block;font-family:var(--sc);font-size:18px;letter-spacing:.06em;text-decoration:none;color:#2a1712;background:linear-gradient(180deg,#f6dc94,#cf9f48 55%,#a87a32);border-radius:999px;padding:13px 24px;box-shadow:0 6px 22px rgba(160,110,40,.35)}
.nav{display:flex;justify-content:space-between;gap:12px;font-family:var(--sc);letter-spacing:.04em}
.grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:18px 12px}
.grid a{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--parch);text-align:center;font-family:var(--sc);font-size:15px}
.grid .card{border-radius:7px;box-shadow:0 6px 16px rgba(10,4,6,.45)}
.foot{text-align:center;font-family:var(--sc);font-size:14px;letter-spacing:.05em}
:focus-visible{outline:2px solid var(--gold-hi);outline-offset:3px}
@media(max-width:620px){.hero{grid-template-columns:1fr}.hero .card{max-width:230px;margin:0 auto}.two{grid-template-columns:1fr}
thead{display:none}table,tbody,tr,th,td{display:block;width:100%}tr{padding:12px 0;border-top:1px solid var(--line)}tr:first-child{border-top:0}th,td{border:0;padding:4px 0}th{font-size:18px}
td::before{content:attr(data-label);display:block;font-family:var(--sc);font-size:14px;letter-spacing:.04em;color:var(--gold-hi);opacity:.85}}`;

const head = (title, desc, url, extra = "") => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta name="theme-color" content="#4a2330"><link rel="icon" type="image/png" href="${SITE}icons/icon-192.png">
<meta property="og:type" content="article"><meta property="og:site_name" content="TarotParrot"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}og-image.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600&family=IM+Fell+English&family=IM+Fell+English+SC&display=swap" rel="stylesheet">
<style>${CSS}</style>${extra}</head><body><main>`;
const foot = rel => `<footer class="foot"><a href="${rel}">TarotParrot</a> · A little birdie told me. · an <a href="https://amarisct.github.io/Amaris/">amaris ct</a> project</footer></main></body></html>\n`;

fs.mkdirSync(path.join(OUT, "cards"), { recursive: true });
const urls = [SITE, SITE + "cards/"];
DECK.forEach((k, i) => {
  const s = slug(k), url = `${SITE}cards/${s}/`, prev = DECK[(i + 77) % 78], next = DECK[(i + 1) % 78];
  const title = `${k.name} Tarot Card Meaning: Upright & Reversed | TarotParrot`;
  const desc = `${k.name} tarot meaning. Upright: ${kw(k.up).join(", ")}. Reversed: ${kw(k.rv).join(", ")}. What it means for love, work, money and more.`;
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: `${k.name} tarot card meaning`, description: desc, url, image: `${SITE}og-image.jpg`, publisher: { "@type": "Organization", name: "TarotParrot" }, about: { "@type": "Thing", name: `${k.name} (tarot card)` } };
  const u = kw(k.up), r = kw(k.rv);
  const FOCUS = { love: ["in how you love and connect", "in how you love and connect"], career: ["at work", "at work"], money: ["with money", "with money"], health: ["in your body and energy", "in your body and energy"], self: ["on your path", "on your path"] };
  const rows = ["love", "career", "money", "health", "self"].map((t, n) => { const L = lens(k, t), a = u[n % u.length], b = r[n % r.length];
    return `<tr><th scope="row">${TOPIC_LABEL[t]}</th><td data-label="Upright">${esc(L[0])} ${esc(k.name)} brings ${esc(a)} ${FOCUS[t][0]}.</td><td data-label="Reversed">${esc(L[1])} Reversed, watch for ${esc(b)} ${FOCUS[t][1]}.</td></tr>`; }).join("");
  const html = head(title, desc, url, `<script type="application/ld+json">${JSON.stringify(ld)}</script>`) + `
<header class="top"><a class="brand" href="../../">TarotParrot</a><nav class="crumbs" aria-label="Breadcrumb"><a href="../">All 78 cards</a> › ${esc(k.name)}</nav></header>
<section class="hero"><div class="card">${ART.face(k)}</div><div style="display:flex;flex-direction:column;gap:14px">
<p class="crumbs" style="margin:0;color:var(--gold-hi)">${k.arcana === "major" ? `Major Arcana · ${ART.ROMAN[k.num]}` : `${SUITS[k.suit].name} · ${SUITS[k.suit].element}`}</p>
<h1>${esc(k.name)} tarot card meaning</h1>
<p class="lede">${esc(about(k))}</p>
<p style="margin:0"><a class="cta" href="../../">Ask TarotParrot a question</a></p></div></section>
<div class="two">
<section class="panel"><h2>Upright</h2><ul class="chips">${kw(k.up).map(x => `<li>${esc(x)}</li>`).join("")}</ul><p>${esc(k.upM)}</p></section>
<section class="panel"><h2>Reversed</h2><ul class="chips">${kw(k.rv).map(x => `<li>${esc(x)}</li>`).join("")}</ul><p>${esc(k.rvM)}</p></section>
</div>
<section class="panel"><h2>${esc(k.name)} in a reading about…</h2><table><thead><tr><th scope="col"></th><th scope="col">Upright</th><th scope="col">Reversed</th></tr></thead><tbody>${rows}</tbody></table></section>
<section class="panel"><h2>Draw it for yourself</h2><p>TarotParrot shuffles the deck with your own touch, the way your phone moves and the moment you ask, then answers your question in plain words. It's free, and nothing leaves your device.</p><p><a class="cta" href="../../">Start a reading</a></p></section>
<nav class="nav" aria-label="More cards"><a href="../${slug(prev)}/">‹ ${esc(prev.name)}</a><a href="../">All cards</a><a href="../${slug(next)}/">${esc(next.name)} ›</a></nav>
` + foot("../../");
  fs.mkdirSync(path.join(OUT, "cards", s), { recursive: true });
  fs.writeFileSync(path.join(OUT, "cards", s, "index.html"), html);
  urls.push(url);
});
const groups = [["Major Arcana", DECK.filter(k => k.arcana === "major")], ...["wands", "cups", "swords", "pentacles"].map(s => [SUITS[s].name, DECK.filter(k => k.suit === s)])];
fs.writeFileSync(path.join(OUT, "cards", "index.html"), head("Tarot Card Meanings: All 78 Cards | TarotParrot", "Every tarot card's meaning, upright and reversed, with what it means for love, work and money. Original watercolor cards from TarotParrot.", SITE + "cards/") + `
<header class="top"><a class="brand" href="../">TarotParrot</a><p class="crumbs" style="margin:0">A little birdie told me.</p></header>
<h1>Tarot card meanings</h1><p class="lede">All 78 cards, upright and reversed, with what each means for love, work, money and more. Tap a card to read it in full, or <a href="../">ask TarotParrot a question</a>.</p>
${groups.map(([g, ks]) => `<section class="panel"><h2>${g}</h2><ul class="grid">${ks.map(k => `<li><a href="${slug(k)}/"><span class="card">${ART.face(k)}</span>${esc(k.name)}</a></li>`).join("")}</ul></section>`).join("")}
` + foot("../"));
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log(`wrote ${DECK.length} card pages, cards/index.html and sitemap.xml (${urls.length} URLs) to ${OUT}`);
