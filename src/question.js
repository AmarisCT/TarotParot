/* ===== Reading the question: topic, kind of question, people mentioned ===== */
const TOPICS = [
  { key: "love", tag: "Love", label: "love", words: ["love","loves","relationship","relationships","partner","boyfriend","girlfriend","husband","wife","crush","dating","marriage","marry","married","ex","romance","romantic","soulmate","soul mate","breakup","break up","broke up","divorce","engaged","engagement","fiance","fiancé","fiancee","kiss","move on","text me","feelings for","like me","get back together","situationship","cheating","cheat"] },
  { key: "career", tag: "Work", label: "your work", words: ["job","jobs","work","working","career","boss","manager","coworker","coworkers","colleague","colleagues","promotion","interview","hire","hired","hiring","business","company","client","clients","offer","position","resign","quit","startup","employer","fired","layoff","laid off","team","office"] },
  { key: "money", tag: "Money", label: "money", words: ["money","finance","finances","financial","debt","debts","rent","salary","raise","pay","paid","income","invest","investment","investing","savings","save","afford","loan","mortgage","budget","rich","wealth","bills","stocks","crypto","price"] },
  { key: "health", tag: "Health", label: "your health and energy", words: ["health","healthy","sick","illness","ill","body","energy","tired","sleep","heal","healing","wellness","wellbeing","well-being","diet","exercise","fitness","stress","stressed","burnout","burned out","recovery","pain","doctor","surgery"] },
  { key: "family", tag: "Family", label: "family", words: ["family","mom","mother","mum","dad","father","parent","parents","sister","brother","sibling","siblings","son","daughter","child","children","kid","kids","baby","pregnant","pregnancy","grandma","grandmother","grandpa","grandfather","cousin","aunt","uncle","in-laws","in laws"] },
  { key: "friends", tag: "Friendship", label: "friendship", words: ["friend","friends","friendship","bestie","best friend","social","group chat"] },
  { key: "home", tag: "Home & travel", label: "a move or a journey", words: ["move","moving","relocate","relocating","apartment","house","home","travel","traveling","travelling","trip","abroad","city","country","vacation","visa","lease"] },
  { key: "study", tag: "Studies", label: "your studies", words: ["school","college","university","uni","exam","exams","test","tests","class","classes","degree","study","studying","studies","grade","grades","application","admission","admissions","scholarship","course","graduate","graduation","thesis"] },
  { key: "create", tag: "Creative work", label: "your creative work", words: ["art","artist","create","creative","creativity","writing","write","writer","book","novel","music","song","songs","album","design","designer","project","brand","website","app","launch","channel","content","youtube","podcast","painting","film"] },
  { key: "self", tag: "Your path", label: "your path", words: ["purpose","path","meaning","spiritual","spirituality","soul","myself","self","growth","grow","become","journey","intuition","calling","life","destiny","happy","happiness","future","healing journey"] }
];
const LENS = {
  love: { major: ["This is a meaningful chapter in your love life, bigger than a passing feeling.","A deeper lesson about love wants facing before things can move."], wands: ["Attraction and chemistry are strong, and passion is pushing things forward.","The spark is there but restless. Watch for impatience and mixed signals."], cups: ["Feelings are real and flowing. This card favors an open heart.","Emotions are blocked or unspoken. Honesty about feelings is needed."], swords: ["Clear, honest communication matters more than romance right now.","Overthinking or sharp words are getting in the way of closeness."], pentacles: ["Love grows through steady, practical commitment and simply showing up.","Routine, money or time pressure is weighing on the bond."] },
  career: { major: ["This is a turning point in your work life, not just a routine shift.","A bigger lesson about your work is surfacing. Don't rush past it."], wands: ["Ambition and initiative are rewarded. Go after what you want.","Burnout or scattered effort is slowing progress. Focus your drive."], cups: ["Meaningful work and good relationships with the people around you matter most here.","You may feel emotionally checked out at work. Notice what's missing."], swords: ["Clear thinking, strategy and honest conversations move things forward.","Tension, miscommunication or stress at work needs to be addressed."], pentacles: ["Steady effort, skill and practical results are building something real.","Pay, stability or progress feels stuck. Review the practical side."] },
  money: { major: ["A significant shift in your finances is underway.","A deeper pattern around money is asking for your attention."], wands: ["Bold moves and new ventures can bring money in.","Impulsive spending or rushed decisions could cost you."], cups: ["There is ease and generosity around money. You have more than you think.","Emotional spending or money worries are clouding things."], swords: ["Make clear-headed, informed decisions, and read the fine print.","Anxiety or confusion about money. Get the facts before you act."], pentacles: ["Material security and steady growth are favored.","Watch for losses, debt or overspending, and tighten the plan."] },
  health: { major: ["Your wellbeing is part of a bigger turning point. Listen to it.","Your body and mind may be asking you to slow down and pay attention."], wands: ["Energy and vitality are strong. Movement and action help.","Energy is running low or scattered. Pace yourself."], cups: ["Emotional wellbeing supports everything else. Rest in good company.","Stress you haven't expressed may be showing up in how you feel."], swords: ["Mental clarity helps, and good information leads to good choices.","Worry and overthinking are draining you. Give your mind a rest."], pentacles: ["Steady routines, sleep and nourishment are your foundation.","Basic self-care has slipped. Return to simple routines."] },
  family: { major: ["This is an important chapter in your family story.","An old family pattern is ready to be seen and changed."], wands: ["There is lively energy at home, and someone's enthusiasm can lift everyone.","Clashing tempers or restlessness at home. Let things cool down."], cups: ["Warmth, care and emotional closeness with family.","Hurt feelings or distance in the family need gentle attention."], swords: ["An honest conversation can clear the air.","Arguments or harsh words are causing strain. Choose words carefully."], pentacles: ["Stability, security and practical support at home.","Money or responsibilities are creating pressure at home."] },
  friends: { major: ["This friendship plays a meaningful part in your story.","Something deeper in this friendship needs to be faced."], wands: ["Fun, adventure and shared enthusiasm keep this bond alive.","Competition or impatience is creating friction."], cups: ["Genuine affection and loyalty. This connection nourishes you.","Feelings have been hurt or left unsaid. Reach out."], swords: ["Honesty will strengthen this friendship, even if it's uncomfortable.","Gossip, misunderstanding or cutting words need repair."], pentacles: ["A steady, reliable friendship you can count on.","The give and take feels uneven. Check the balance."] },
  home: { major: ["This move or journey marks a real turning point.","Something unfinished may be holding you in place."], wands: ["Adventure calls, and momentum favors going.","Plans may be rushed or delayed. Double-check the details."], cups: ["Follow where your heart feels at home.","Nostalgia or mixed feelings are making it hard to leave."], swords: ["Weigh the facts clearly. A logical plan smooths the way.","Stress and second-guessing. Get clear before you decide."], pentacles: ["The practical foundations are solid, and the numbers can work.","Costs or logistics need a closer look."] },
  study: { major: ["This learning is shaping who you are becoming.","A deeper lesson sits beneath the coursework. Slow down."], wands: ["Enthusiasm and drive carry you. Dive in.","Procrastination or scattered focus is the main obstacle."], cups: ["Study what you love; passion makes it stick.","Motivation is low. Reconnect with why this matters to you."], swords: ["Sharp thinking and focus favor exams and decisions.","Nerves or overthinking. Trust your preparation."], pentacles: ["Steady practice and discipline pay off.","Your routine needs structure. Small daily steps help."] },
  create: { major: ["This creative work is tied to your larger purpose.","A creative block is holding a lesson. Listen to it."], wands: ["Inspiration is hot. Start it, launch it, make it.","Lots of ideas, little follow-through. Pick one."], cups: ["Make what moves you; feeling is your fuel.","Self-doubt or a dry spell. Be gentle with the process."], swords: ["Sharpen the idea. Editing and a clear vision win.","Harsh self-criticism is getting in the way."], pentacles: ["Craft and consistency turn this into something lasting, even profitable.","Practical limits like time or money need a plan."] },
  self: { major: ["You are in a significant season of growth.","An inner lesson keeps repeating until it is learned."], wands: ["Follow what lights you up; passion points the way.","Restlessness is a signal. Slow down enough to hear what you want."], cups: ["Trust your heart and intuition as your compass.","Reconnect with your feelings. You have been running on empty."], swords: ["Clarity about what's true for you is arriving.","Your inner critic is too loud. Question its story."], pentacles: ["Ground your growth in daily practice and in your body.","You have been neglecting the basics that keep you steady."] }
};
// cards that lean strongly one way for yes-or-no questions (by deck id)
const YES_LEAN = { 19: 2, 17: 1, 21: 1, 1: 1, 3: 1, 6: 1, 7: 1, 10: 1, 22: 1, 27: 1, 36: 1, 37: 1, 38: 1, 44: 2, 45: 1, 64: 1 };
const NO_LEAN = { 16: 2, 15: 1, 59: 2, 52: 1, 57: 1, 58: 1, 68: 1, 40: 1, 54: 1 };
const _qa = {};
function analyzeQuestion(q) {
  q = (q || "").trim();
  if (_qa[q]) return _qa[q];
  const t = q.toLowerCase().replace(/[’']/g, "'");
  let best = null, bestN = 0;
  for (const tp of TOPICS) {
    let n = 0;
    for (const w of tp.words) { const m = t.match(new RegExp("(^|[^a-z])" + w.replace(/[-]/g, "\\-") + "(?![a-z])", "g")); if (m) n += m.length; }
    if (n > bestN) { best = tp; bestN = n; }
  }
  let type = "open";
  if (/^\s*(when|how (long|soon))\b/.test(t)) type = "when";
  else if (/^\s*(should|will|is|are|am|does|do|did|can|could|would|has|have|was|were|shall|won't|isn't|am i)\b/.test(t) || /\bshould i\b|\bwill (he|she|they|i|it|we)\b/.test(t)) type = "yesno";
  else if (/^\s*how\b/.test(t)) type = "how";
  else if (/^\s*why\b/.test(t)) type = "why";
  const pm = t.match(/\bmy (best friend|partner|boyfriend|girlfriend|husband|wife|crush|ex|boss|manager|friend|mom|mum|mother|dad|father|sister|brother|son|daughter|child|coworker|colleague|team|client|landlord|teacher)\b/);
  const person = pm ? "your " + pm[1] : (/\b(he|she|him|her|they|them|his)\b/.test(t) ? "the person you're asking about" : null);
  return (_qa[q] = { topic: best, type, person });
}
function lensFor(topic, card, rev) {
  if (!topic) return "";
  const L = LENS[topic.key][card.arcana === "major" ? "major" : card.suit];
  return L[rev ? 1 : 0];
}
function yesNo(cards) {
  let s = 0, wait = 0, unclear = 0;
  cards.forEach(c => {
    s += c.rev ? -1 : 1;
    if (YES_LEAN[c.id]) s += c.rev ? 0 : YES_LEAN[c.id];
    if (NO_LEAN[c.id]) s -= c.rev ? 0 : NO_LEAN[c.id];
    if (c.id === 12 || c.id === 53 || c.id === 70) wait++;
    if (c.id === 18 || c.id === 51) unclear++;
  });
  if (unclear && Math.abs(s) <= 1) return { lean: "unclear", text: "The answer is hazy for now. Something important isn't visible yet, so give it time and ask again when you know more.", short: "the answer is still hazy" };
  if (wait && Math.abs(s) <= 2) return { lean: "wait", text: "The cards say not yet. A pause is part of the answer; this needs more time before it can move.", short: "not yet, give it time" };
  if (s >= 2) return { lean: "yes", text: "The cards lean toward yes.", short: "it's leaning yes" };
  if (s <= -2) return { lean: "no", text: "The cards lean toward no, or not in the way you're picturing it.", short: "it's leaning no, for now" };
  return { lean: "maybe", text: "The answer isn't fixed. It depends on choices you are still making, so the cards below show what tips it.", short: "it could go either way, and it's up to you" };
}
function whenVerdict(cards) {
  if (cards.some(c => c.id === 29 && !c.rev)) return "Soon, likely within days. The Eight of Wands says things move fast.";
  if (cards.some(c => (c.id === 12 || c.id === 53) && !c.rev)) return "After a pause. Things move once a period of rest or waiting has passed.";
  const counts = { wands: 0, cups: 0, swords: 0, pentacles: 0 }; let majors = 0;
  cards.forEach(c => { if (c.suit) counts[c.suit]++; else majors++; });
  if (majors > cards.length / 2) return "When you are ready. This is tied to a bigger shift, not a set clock.";
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return { wands: "Fairly soon, within days to a few weeks, once you take action.", swords: "Within weeks, once a decision is made or a conversation happens.", cups: "In a few months, as feelings settle and things unfold naturally.", pentacles: "Slowly and steadily, over a season or longer, built step by step." }[top];
}
function whenText(cards) {
  if (cards.some(c => c.id === 29 && !c.rev)) return "Timing looks quick: the Eight of Wands says things move fast, likely within days.";
  if (cards.some(c => (c.id === 12 || c.id === 53) && !c.rev)) return "Timing involves a pause. Things move after a period of rest or waiting, not right away.";
  const counts = { wands: 0, cups: 0, swords: 0, pentacles: 0 }; let majors = 0;
  cards.forEach(c => { if (c.suit) counts[c.suit]++; else majors++; });
  if (majors > cards.length / 2) return "Timing is tied to a bigger shift. It happens when you are ready, not on a set clock.";
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return { wands: "Timing looks fairly quick, within days to a few weeks, once you take action.", swords: "Timing looks like weeks, once a decision is made or a conversation happens.", cups: "Timing looks like a few months, as feelings settle and things unfold naturally.", pentacles: "Timing is slow and steady, likely a season or longer, built step by step." }[top];
}

/* ===== A direct answer to the question ===== */
function youify(q) {
  const swaps = [[/\bam i\b/gi, "are you"], [/\bi am\b/gi, "you are"], [/\bi'm\b/gi, "you're"], [/\bwas i\b/gi, "were you"], [/\bi was\b/gi, "you were"],
    [/\bi've\b/gi, "you've"], [/\bi'll\b/gi, "you'll"], [/\bi'd\b/gi, "you'd"], [/\bmyself\b/gi, "yourself"], [/\bmine\b/gi, "yours"],
    [/\bmy\b/gi, "your"], [/\bme\b/gi, "you"], [/\bi\b/gi, "you"]];
  let s = (q || "").trim().replace(/[’]/g, "'");
  for (const [re, to] of swaps) s = s.replace(re, to);
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[?.!]$/.test(s)) s += "?";
  return s;
}
const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
const first = s => (s.match(/^[^.!?]*[.!?]/) || [s])[0].trim();
const rest = s => s.slice(first(s).length).trim();
const nm = c => c.name + (c.rev ? ", reversed," : "");
const nmEnd = c => c.name + (c.rev ? " reversed" : "");
const mean = c => c.rev ? c.rvM : c.upM;
const kws = c => { const p = (c.rev ? c.rv : c.up).split(" · "); return p.length > 1 ? p[0] + " and " + p[1] : p[0]; };
// which card plays which part, per spread
function roles(spread, cards) {
  if (spread === "celtic") return { now: cards[0], block: cards[1], root: cards[2], past: cards[3], out: cards[9], adv: cards[6], fear: cards[8] };
  if (spread === "three") return { past: cards[0], now: cards[1], out: cards[2], adv: cards[1], root: cards[0] };
  return { now: cards[0], out: cards[0], adv: cards[0], root: cards[0] };
}
function answerReading(r) {
  const cards = r.cards.map(c => Object.assign({}, DECK[c.id], { rev: c.rev }));
  const A = analyzeQuestion(r.question), R = roles(r.spread, cards), single = cards.length === 1;
  const q = r.question ? youify(r.question) : "";
  const isShould = /^\s*should\b/i.test(r.question || "") || /\bshould i\b/i.test(r.question || "");
  const lens = c => A.topic ? lensFor(A.topic, c, c.rev) : "";
  let verdict = "", lines = [];
  // the story the cards tell, in their positions
  const story = single
    ? `${nmEnd(R.now)} came up for this. ${mean(R.now)}`
    : r.spread === "three"
      ? `Looking back, ${nm(R.past)} shows this grew out of ${kws(R.past)}. Right now, ${nmEnd(R.now)} says ${lc(first(mean(R.now)))} Ahead, ${nm(R.out)} points to ${kws(R.out)}.`
      : `At the heart of it is ${nmEnd(R.now)}: ${lc(first(mean(R.now)))} What stands in your way is ${nmEnd(R.block)}, which means ${kws(R.block)}. Underneath it all sits ${nmEnd(R.root)}, ${kws(R.root)}. Where this is heading is ${nmEnd(R.out)}: ${lc(first(mean(R.out)))}`;
  const advice = single ? (rest(mean(R.adv)) || first(mean(R.adv))) : first(mean(R.adv)) + (rest(mean(R.adv)) ? " " + rest(mean(R.adv)) : "");
  if (A.type === "yesno") {
    const pool = single ? cards : cards.concat([R.out, R.out]);
    const yn = yesNo(pool);
    verdict = {
      yes: isShould ? "Yes. The cards say go for it." : "Likely yes.",
      no: isShould ? "Not right now." : "Unlikely, as things stand.",
      maybe: isShould ? "It's your call, and the cards show what tips it." : "It could go either way.",
      wait: "Not yet. Give it time.",
      unclear: "The answer is still hidden."
    }[yn.lean];
    lines.push(story);
    if (lens(R.out)) lines.push(`For ${A.topic.label}: ${lc(lens(R.out))}`);
    lines.push({
      yes: isShould ? `So if it feels right, go ahead, and keep ${nmEnd(R.adv)} in mind: ${lc(advice)}` : `What helps it happen: ${lc(advice)}`,
      no: isShould ? `Hold off, or change the plan first. ${nmEnd(R.adv)} shows what needs attention: ${lc(advice)}` : `If you want a different outcome, this is what would need to change: ${lc(advice)}`,
      maybe: `What tips it in your favor: ${lc(advice)}`,
      wait: `Use the waiting time well: ${lc(advice)}`,
      unclear: `Something important isn't visible yet. Gather more information, then ask again. Meanwhile: ${lc(advice)}`
    }[yn.lean]);
  } else if (A.type === "when") {
    verdict = whenVerdict(cards);
    lines.push(story);
    lines.push(`What speeds it up: ${lc(advice)}`);
  } else if (A.type === "how") {
    verdict = `Here's how: ${kws(R.adv)}.`;
    lines.push(`Your guide is ${nmEnd(R.adv)}. ${advice}`);
    if (!single) lines.push(`Do that, and it leads toward ${nmEnd(R.out)}: ${lc(first(mean(R.out)))}`);
    if (lens(R.adv)) lines.push(`For ${A.topic.label}: ${lc(lens(R.adv))}`);
  } else if (A.type === "why") {
    verdict = `Because of ${kws(R.root)}.`;
    lines.push(`The root of it is ${nmEnd(R.root)}. ${mean(R.root)}`);
    if (!single && R.now !== R.root) lines.push(`That's why ${nmEnd(R.now)} shows up right now: ${lc(first(mean(R.now)))}`);
    lines.push(`What changes it: ${lc(advice)}`);
  } else {
    verdict = single ? `${R.now.name}${R.now.rev ? " reversed" : ""}: ${kws(R.now)}.` : `The message is ${kws(R.now)}, heading toward ${kws(R.out)}.`;
    lines.push(story);
    if (lens(R.out)) lines.push(`For ${A.topic.label}: ${lc(lens(R.out))}`);
    if (!single) lines.push(`Your advice: ${lc(advice)}`);
  }
  if (A.topic && A.topic.key === "health") lines.push("Tarot is for reflection, so for anything medical, check in with a doctor too.");
  return { question: q, verdict, lines };
}
