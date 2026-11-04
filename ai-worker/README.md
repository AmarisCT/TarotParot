# TarotParrot AI readings (optional)

This tiny server lets TarotParrot offer an "AI-written reading" button. It sends only the question, the spread and the cards already drawn to Claude, and returns a symbolic interpretation. The cards never change. Birthdays, notes and journals are never sent.

The button stays hidden in the app until you finish these steps.

## Set it up (about 15 minutes)

1. **Get an Anthropic API key** at console.anthropic.com → API Keys. Add a little credit (a few dollars covers many readings) and set a monthly spending limit there.
2. **Create a free Cloudflare account** at dash.cloudflare.com.
3. In Cloudflare, go to **Workers & Pages → Create → Worker**, name it `tarotparrot-ai`, and deploy the starter.
4. Click **Edit code**, replace everything with the contents of `worker.js`, and click **Deploy**.
5. Go to the worker's **Settings → Variables and Secrets**:
   - Add a **Secret** named `ANTHROPIC_API_KEY` with your key.
   - Add a **Text** variable named `ALLOWED_ORIGIN` with `https://amarisct.github.io`
6. Copy the worker's address (it looks like `https://tarotparrot-ai.<your-name>.workers.dev`).
7. In `src/app.js`, set `const AI_ENDPOINT = "https://tarotparrot-ai.<your-name>.workers.dev";`, run `python3 build.py`, and push. (Or ask Claude to do this part.)

## Keep costs safe

- Set a spending limit in the Anthropic console.
- In Cloudflare, add a **Rate limiting rule** for the worker (for example, 10 requests per minute per visitor).
- The server only answers requests from your site, and caps each reading at about 260 words.
