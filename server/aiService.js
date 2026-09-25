// server/aiService.js
//
// Calls Google's Gemini API to suggest a side quest. This lives on the
// server, not the client, specifically so the API key never ships to the
// browser — a client-side call would expose it to anyone who opens
// DevTools.

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const PROMPT = `Suggest one short, fun "side quest" for someone who is bored —
a small, doable real-world activity (not a chore, not generic advice).
Keep the quest text under 15 words.
Pick a category: creative, physical, social, or weird.

Respond with ONLY raw JSON, no markdown formatting, no code fences, in
exactly this shape:
{"text": "...", "category": "..."}`;

export async function generateQuestIdea() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set on the server');
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 300,
        // Gemini's newer models "think" before answering by default, which
        // can consume the entire token budget on invisible reasoning and
        // leave the actual output empty. This task is simple enough not to
        // need that, so it's turned off.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${body}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    // Log the full response so a future empty-output failure is diagnosable
    // (e.g. finishReason: 'MAX_TOKENS' or a safety block) instead of a
    // guessing game.
    console.error('Gemini returned no text. Full response:', JSON.stringify(data, null, 2));
    throw new Error('Gemini API returned an empty response');
  }

  // The model is asked for raw JSON, but strip code fences defensively in
  // case it wraps the response in ```json anyway.
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('Gemini API returned unparseable JSON');
  }

  if (!parsed.text) {
    throw new Error('Gemini API response was missing quest text');
  }

  return {
    text: String(parsed.text).slice(0, 200),
    category: parsed.category || null,
  };
}