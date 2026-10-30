/* ===== The deck: 78 cards, meanings written for TarotParrot ===== */
const SUITS = {
  wands:     { name: "Wands",     element: "Fire",  domain: "drive, creativity and ambition" },
  cups:      { name: "Cups",      element: "Water", domain: "feelings and relationships" },
  swords:    { name: "Swords",    element: "Air",   domain: "thoughts, words and conflict" },
  pentacles: { name: "Pentacles", element: "Earth", domain: "money, work, body and home" }
};
const RANKS = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
const RANK_PLURAL = ["Aces","Twos","Threes","Fours","Fives","Sixes","Sevens","Eights","Nines","Tens","Pages","Knights","Queens","Kings"];
const RANK_THEME = {1:"new beginnings",2:"balance and choices",3:"growth and collaboration",4:"stability and structure",5:"conflict and change",6:"harmony and healing",7:"reflection and assessment",8:"movement and mastery",9:"nearing completion",10:"endings and culmination"};

const MAJ = [
 ["The Fool","new beginnings · faith · spontaneity","recklessness · hesitation · fear of change","Something new is opening. Step toward it with curiosity and trust, even before you can see the whole road.","Either fear is keeping you at the edge, or you are about to jump without looking. Be brave, but stay awake."],
 ["The Magician","willpower · skill · manifestation","scattered energy · manipulation · untapped talent","You already hold every tool you need. Focus your will and act; this is a moment where intention turns into results.","Your power is leaking in too many directions, or someone is using clever words to steer you. Gather your focus and check motives, yours included."],
 ["The High Priestess","intuition · mystery · inner knowing","secrets · disconnection · ignoring your gut","The answer is quieter than you expect. Get still, listen to your intuition, and trust what you know without being able to prove it.","You are tuning out your inner voice, or something is being kept hidden. Make space for silence before you decide."],
 ["The Empress","abundance · nurture · creativity","smothering · creative block · self-neglect","Growth comes through care. Nurture what you love, including your body and your creative work, and let it flourish at its own pace.","You may be giving so much that you have run dry, or holding on too tightly. Tend to yourself first."],
 ["The Emperor","structure · authority · stability","rigidity · control · lack of discipline","Build the framework. Clear rules, steady leadership and a plan will turn this situation into something solid.","Control has tipped into rigidity, or there is no structure at all. Look at who holds power here and whether it is used well."],
 ["The Hierophant","tradition · guidance · shared beliefs","rebellion · questioning norms · your own path","There is wisdom in the established way. A mentor, a tradition or a trusted institution can guide you now.","The usual rules do not fit you here. It may be time to question convention and find your own way of doing things."],
 ["The Lovers","love · alignment · meaningful choice","disharmony · misaligned values · avoidance","A bond or a choice asks for your whole heart. Choose what truly aligns with your values, and the connection deepens.","Something is out of balance, in a relationship or within yourself. Be honest about what you actually want."],
 ["The Chariot","determination · momentum · victory","lack of direction · opposition · lost control","Pull your opposing impulses into one direction and drive. Willpower and focus carry you forward to a win.","You are being pulled two ways, or pushing too hard against resistance. Take back the reins before you speed up."],
 ["Strength","courage · compassion · inner strength","self-doubt · low energy · raw emotion","Gentle strength wins this one. Patience, compassion and quiet confidence can tame what force never could.","Self-doubt is louder than usual. Be kind to yourself and rebuild your confidence one small act at a time."],
 ["The Hermit","solitude · reflection · inner guidance","isolation · loneliness · withdrawal","Step back from the noise. Time alone with your thoughts will light the next stretch of the path.","Solitude has turned into isolation. Reach out; you do not have to figure this out entirely by yourself."],
 ["Wheel of Fortune","cycles · fate · turning point","resisting change · bad luck · repeating patterns","The wheel is turning. Change is coming whether you plan for it or not, and it is likely moving in your favor.","A cycle is repeating, or luck feels stuck. Notice the pattern; you can step out of it."],
 ["Justice","fairness · truth · cause and effect","unfairness · dishonesty · avoiding accountability","Truth and fairness prevail. Decisions made now carry consequences, so act with integrity and expect a just result.","Something here is not fair, or someone is avoiding responsibility. Be honest, first with yourself."],
 ["The Hanged Man","pause · surrender · new perspective","stalling · resistance · indecision","Pause. Letting go of the need to act right now will show you the situation from a completely new angle.","You are stalling, or resisting a sacrifice that needs to happen. Waiting longer will not make the choice easier."],
 ["Death","endings · transformation · transition","resisting change · stagnation · fear of endings","Something is ending so something else can begin. Rarely literal, this card marks a deep and needed transformation.","You are holding on to what is already over. Releasing it frees the energy you need for what comes next."],
 ["Temperance","balance · patience · moderation","excess · imbalance · impatience","Blend, don't force. Patience and a measured middle path will bring the healing and harmony you are after.","Things are out of balance: too much of one thing, too little of another. Slow down and recalibrate."],
 ["The Devil","attachment · temptation · shadow self","release · breaking free · reclaiming power","Look at what has a hold on you: a habit, a fear, a relationship. The chains are looser than they seem.","You are ready to break free. Naming the pattern is the first step out of it."],
 ["The Tower","sudden change · upheaval · revelation","averted disaster · fear of change · delayed upheaval","A sudden shake-up clears what was built on shaky ground. It is unsettling, but it reveals the truth and makes room to rebuild.","You may be bracing against a change that needs to happen. Letting it come gently is easier than waiting for it to crash."],
 ["The Star","hope · renewal · inspiration","discouragement · lost faith · disconnection","After the storm comes calm. Hope, healing and quiet inspiration are flowing back to you.","You have lost sight of your hope for a moment. It is not gone; reconnect with what once lit you up."],
 ["The Moon","intuition · illusion · the unconscious","clarity returning · released fear · lifting confusion","Not everything is as it appears. Move carefully, trust your instincts, and let dreams and feelings guide you through the uncertainty.","The fog is lifting. Fears that felt huge are shrinking, and the truth is coming into view."],
 ["The Sun","joy · success · vitality","passing clouds · dimmed optimism · overconfidence","Warmth, success and pure joy. This is one of the brightest cards in the deck: things are working out.","The light is still there, just behind a cloud. Reconnect with simple joys, and do not let doubt or ego dim them."],
 ["Judgement","awakening · reckoning · a calling","self-doubt · ignoring the call · harsh self-judgment","You are being called to rise. Reflect honestly on the past, forgive it, and answer the call toward who you are becoming.","You are judging yourself too harshly, or ignoring an inner calling. Listen; it is still there."],
 ["The World","completion · wholeness · accomplishment","unfinished business · shortcuts · seeking closure","A cycle is complete. Celebrate how far you have come; you are whole and ready for the next adventure.","You are close, but something is left unfinished. Tie up the loose ends before you move on."]
];

const MIN = {
 wands: [
  ["inspiration · new venture · spark","delays · lost motivation · false start","A spark of inspiration arrives. Act on it while the fire is fresh.","The spark is there but stalled. Find what is blocking your momentum before you push."],
  ["planning · future vision · decisions","fear of the unknown · playing safe · poor planning","You hold the world in your hands. Plan boldly and decide where to go next.","Staying where it is safe may be costing you. Make the plan, then take the first step."],
  ["expansion · foresight · progress","obstacles · delays · frustration","Your efforts are starting to pay off. Look ahead; your ships are coming in.","Progress is slower than you hoped. Adjust your expectations, not your vision."],
  ["celebration · home · harmony","transition · unsettled home · lack of support","A moment to celebrate: home, community and a milestone reached.","Home or a group feels unsettled. Find your own sense of stability while things shift."],
  ["conflict · competition · tension","avoiding conflict · resolution · inner conflict","Clashing egos and competing goals. Healthy competition can sharpen you if you keep it fair.","The fight is winding down, or you are avoiding one that needs to happen. Look for common ground."],
  ["victory · recognition · confidence","ego · fall from grace · going unnoticed","Public success and well-earned recognition. Ride proudly.","Recognition is not arriving, or pride is getting in the way. Your worth does not depend on applause."],
  ["standing your ground · defense · perseverance","overwhelm · giving up · feeling attacked","Hold your position. You have the high ground; defend what matters.","You are worn down from defending. Choose which battles are worth it."],
  ["speed · movement · swift news","delays · frustration · slowing down","Things are moving fast. News, travel or progress arrives quickly.","Momentum has stalled. Wait for the right moment instead of forcing it."],
  ["resilience · persistence · the last stretch","exhaustion · defensiveness · stubbornness","You are tired, but nearly there. One more push.","Your guard is up so high it is wearing you out. Rest, and let someone help."],
  ["burden · responsibility · hard work","release · delegating · burnout","You are carrying too much. The finish is close, but lighten the load.","It is time to put some of this down. Delegate, or say no."],
  ["curiosity · enthusiasm · new ideas","distraction · no direction · hasty starts","An exciting idea or message arrives. Explore it with a beginner's enthusiasm.","Lots of ideas, little follow-through. Pick one and nurture it."],
  ["action · adventure · passion","impulsiveness · haste · scattered energy","Charge ahead with energy and courage; adventure calls.","Rushing in could backfire. Channel the fire before it burns out."],
  ["confidence · warmth · determination","jealousy · insecurity · demanding","Radiate confidence. Your warmth and determination draw people in.","Insecurity is dimming your light. Reclaim your confidence without needing to prove it."],
  ["vision · leadership · boldness","arrogance · impulsive leadership · impossible standards","Lead with vision. You see the big picture and can inspire others to follow.","Big plans need patience and humility. Do not let ego drive."]
 ],
 cups: [
  ["new love · emotional opening · compassion","bottled feelings · emotional block · emptiness","Your heart is opening. New love, friendship or creative feeling pours in.","Feelings are bottled up. Let yourself feel before you try to fix anything."],
  ["partnership · mutual attraction · connection","imbalance · broken communication · tension","A meaningful connection built on mutual respect and attraction.","Something in a partnership is off balance. Talk it through honestly."],
  ["friendship · celebration · community","gossip · overindulgence · isolation","Celebrate with the people who lift you up.","A social circle feels strained, or the party has gone too far. Check in with your real friends."],
  ["apathy · contemplation · missed offers","renewed interest · new awareness · acceptance","You may be so focused on what is missing that you are overlooking what is being offered.","You are coming out of a slump and seeing new possibilities. Say yes to one of them."],
  ["grief · loss · regret","acceptance · moving on · forgiveness","Something was lost, and it hurts. But not everything spilled; look at what remains.","You are beginning to heal and move forward. Forgiveness, of yourself too, is near."],
  ["nostalgia · childhood · innocence","stuck in the past · moving forward · independence","Sweet memories, old friends, or a simple kindness from the past.","Living in the past is holding you back. Honor it, then turn toward the future."],
  ["choices · fantasy · illusion","clarity · decision · reality check","Many options shimmer before you, but not all are real. Look closely before you choose.","The fog of options is clearing. You know what you actually want."],
  ["walking away · seeking more · disillusionment","fear of change · drifting · staying too long","It is time to leave something that no longer fulfills you, even if it looks fine from outside.","You know you need to move on, but you are hesitating, or running from what you should face."],
  ["contentment · wishes granted · satisfaction","smugness · dissatisfaction · materialism","The wish card. Contentment and satisfaction are yours; enjoy them.","What you wished for did not bring the joy you expected. Look for what truly fulfills you."],
  ["harmony · family · lasting happiness","disconnection · broken harmony · misaligned values","Emotional fulfillment and harmony at home. Love that lasts.","The picture-perfect family or relationship has cracks. Focus on real connection, not appearances."],
  ["creative opportunity · intuitive message · curiosity","emotional immaturity · creative block · escapism","A sweet surprise, a creative idea, or an intuitive nudge. Stay open.","Feelings are running young and raw. Ground them before you act."],
  ["romance · charm · following the heart","moodiness · unrealistic expectations · jealousy","An invitation or romantic offer arrives. Follow your heart, gracefully.","Romance or idealism is clouding judgment. Check the reality behind the charm."],
  ["compassion · emotional security · intuition","insecurity · codependence · overwhelm","Lead with compassion and trust your intuition. You hold space for others beautifully.","You are absorbing everyone else's feelings. Protect your own well-being."],
  ["emotional balance · diplomacy · calm","emotional manipulation · moodiness · coldness","Stay calm and kind. Emotional maturity lets you steer through choppy water.","Emotions are being suppressed or used as leverage. Find your balance."]
 ],
 swords: [
  ["clarity · breakthrough · truth","confusion · miscommunication · clouded judgment","A breakthrough: clear thinking cuts straight to the truth.","Your thinking is clouded. Get the facts before you decide."],
  ["stalemate · difficult choice · avoidance","indecision · information overload · lesser of two evils","You are avoiding a decision by refusing to look. Take off the blindfold.","Too much input, not enough clarity. Pick the option that is most honest."],
  ["heartbreak · sorrow · painful truth","recovery · forgiveness · releasing pain","A painful truth or heartbreak. Let yourself grieve; it is how healing starts.","The sharpest pain is passing. You are beginning to release it."],
  ["rest · recovery · contemplation","restlessness · burnout · a forced pause","Rest. Recovery is productive right now.","You are running on empty. Stop before your body makes you."],
  ["conflict · winning at a cost · tension","reconciliation · making amends · moving past conflict","A win that costs more than it is worth. Ask whether this fight is really yours.","It is time to make peace and move past an old argument."],
  ["transition · moving on · calmer waters","unfinished business · resisting change · turbulence","You are moving toward calmer waters. Leave the trouble behind.","You are trying to leave, but something keeps pulling you back. Resolve it first."],
  ["strategy · stealth · cunning","confession · getting caught · conscience","Strategy is needed, but watch for deception, yours or someone else's.","Secrets are surfacing. Come clean, or notice who is being less than honest."],
  ["feeling trapped · restriction · limiting beliefs","release · new perspective · freedom","You feel trapped, but the bindings are looser than they look. Your mind is the cage.","You are freeing yourself from limiting beliefs. The way out is clearer now."],
  ["anxiety · worry · sleepless nights","hope · reaching out · releasing worry","Worry is keeping you up. The fear in your head is bigger than the reality.","The worst of the anxiety is passing. Talk about it and it will shrink further."],
  ["painful ending · rock bottom · betrayal","recovery · regeneration · resisting the end","A hard ending. It is over, and the only way from here is up.","You are past the worst. Recovery has begun, so stop reopening the wound."],
  ["curiosity · new ideas · vigilance","gossip · all talk · scattered thinking","A sharp mind and eager questions. Gather information and stay alert.","Words are flying without substance. Think before you speak."],
  ["ambition · drive · fast thinking","restlessness · recklessness · burnout","Charge toward your goal with sharp focus and speed.","Moving too fast without a plan. Slow down before you crash."],
  ["clear boundaries · honesty · independence","coldness · bitterness · harsh words","Clear-eyed and honest. Set boundaries and speak your truth plainly.","Honesty has turned harsh. Soften the edge without losing the truth."],
  ["intellect · authority · truth","manipulation · cruelty · misuse of power","Think it through and decide with fairness and logic.","Logic is being used as a weapon. Watch for misuse of power."]
 ],
 pentacles: [
  ["new opportunity · prosperity · manifestation","missed chance · poor planning · scarcity mindset","A real, tangible opportunity in money, work or health. Plant the seed.","An opportunity may slip by. Check your planning and your follow-through."],
  ["balance · adaptability · juggling priorities","overwhelm · disorganization · overcommitment","You are juggling a lot, and doing it well. Stay flexible.","Too many balls in the air. Drop the ones that do not matter."],
  ["teamwork · collaboration · craft","disharmony · poor teamwork · low effort","Collaboration and skill come together. Your work is being noticed.","The team is not aligned. Clarify roles and expectations."],
  ["security · saving · control","greed · letting go · financial worry","You are holding tightly to what you have. Security is good; just do not let it become a cage.","Loosen your grip on money, things or control. Generosity opens doors."],
  ["hardship · loss · feeling left out","recovery · help arriving · the end of hardship","Times are tight or lonely. Help is closer than you think; look for the lit window.","The hard stretch is ending. Accept the help that is offered."],
  ["generosity · giving and receiving · fairness","debt · strings attached · one-sided giving","Give and receive with an open hand. Balance and generosity flow.","Watch for help with strings attached, or giving that leaves you empty."],
  ["patience · long-term view · assessment","impatience · poor returns · wasted effort","Your efforts are growing. Pause, assess, and be patient with the harvest.","The results are not matching the effort. Rethink where you invest your energy."],
  ["skill · dedication · mastery","perfectionism · lack of focus · cutting corners","Put your head down and practice. Mastery comes through steady work.","Perfectionism or distraction is slowing you down. Focus on the craft, not the flaws."],
  ["self-sufficiency · luxury · independence","overworking · dependence · hollow success","You have earned this comfort. Enjoy the independence you built.","Success feels hollow, or you depend on others more than you would like. Rebalance."],
  ["legacy · wealth · family","family conflict · financial loss · short-term thinking","Lasting wealth and legacy. Build something that will outlast you.","Money or family matters need attention. Think about the long term."],
  ["ambition · a new skill · diligence","procrastination · stalled progress · missed lessons","A new chance to learn and grow. Study, plan and commit.","Plans are not turning into action. Start small, but start."],
  ["routine · reliability · hard work","stagnation · boredom · laziness","Steady, methodical progress. Slow and reliable wins.","Routine has become a rut. Shake things up just enough."],
  ["nurturing · practicality · comfort","self-neglect · work-home imbalance · smothering","Practical care: create comfort and security for yourself and others.","You are caring for everyone but yourself. Restore the balance."],
  ["abundance · security · leadership","greed · stubbornness · obsession with status","Steady success and material security. Lead with generosity.","Material focus has gone too far. Remember what the wealth is for."]
 ]
};

const DECK = [];
MAJ.forEach((m, i) => DECK.push({ id: i, arcana: "major", num: i, name: m[0], up: m[1], rv: m[2], upM: m[3], rvM: m[4] }));
["wands","cups","swords","pentacles"].forEach(s => MIN[s].forEach((m, r) => DECK.push({
  id: DECK.length, arcana: "minor", suit: s, rank: r + 1,
  name: RANKS[r] + " of " + SUITS[s].name, up: m[0], rv: m[1], upM: m[2], rvM: m[3]
})));
