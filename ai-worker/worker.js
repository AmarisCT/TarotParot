// TarotParrot AI reading server (Cloudflare Worker).
// Receives a question and the cards already drawn, asks Claude for a symbolic interpretation,
// and returns plain text. The API key stays here as a secret; it never reaches the browser.

const MODEL = "claude-haiku-5-5";
const SYSTEM = `You are the voice of TarotParrot, a gentle, warm tarot reader. Tagline: "A little birdie told me."
Write one connected reading for the cards provided, in the positions provided. Rules:
- The cards are fixed. Never add, change, or re-draw cards.
- Weave the cards together: show how they support, complicate or contradict each other, and respect each position and reversal.
- Answer the person's actual question directly in the first sentence, as a symbolic interpretation ("the cards suggest…").
- Never claim to know another person's private thoughts or feelings, and never guarantee future events.
- No medical, legal or financial instructions; if the question touches those, gently suggest a professional.
- If the question mentions self-harm or danger, set the reading aside and encourage reaching out to someone they trust or local emergency services.
- Plain, warm language. 2 to 4 short paragraphs, under 260 words. No headings, no lists, no emoji.`;

function cors(origin, allowed) {
  const ok = allowed.split(",").map(s => s.trim()).includes(origin);
  return { "Access-Control-Allow-Origin": ok ? origin : allowed.split(",")[0].trim(), "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Vary": "Origin" };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", ...headers } });

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "https://amarisct.github.io";
    const headers = cors(origin, allowed);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, headers);
    if (!allowed.split(",").map(s => s.trim()).includes(origin)) return json({ error: "This site isn't allowed." }, 403, headers);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Bad request." }, 400, headers); }
    const cards = Array.isArray(body.cards) ? body.cards.slice(0, 12) : [];
    if (!cards.length) return json({ error: "No cards were sent." }, 400, headers);
    const clean = s => String(s || "").replace(/\s+/g, " ").trim().slice(0, 300);
    const question = clean(body.question);
    const lines = cards.map((c, i) => `${i + 1}. ${clean(c.position)} (${clean(c.meaning)}): ${clean(c.card)}${c.reversed ? ", reversed" : ""}`).join("\n");
    const prompt = `Spread: ${clean(body.spread)}\nQuestion: ${question || "(no question; give a general reading)"}\nCards:\n${lines}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: env.MODEL || MODEL, max_tokens: 700, system: SYSTEM, messages: [{ role: "user", content: prompt }] })
    });
    if (!res.ok) return json({ error: "The AI service is busy. Try again soon." }, 502, headers);
    const data = await res.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n\n").trim();
    return json({ text }, 200, headers);
  }
};
