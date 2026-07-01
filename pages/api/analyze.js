// This runs on the server, never in the user's browser.
// Your API key stays hidden here — it's read from an environment
// variable, not written in the code.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { error, code } = req.body;

  if (!error || !code) {
    return res.status(400).json({ error: "Missing error or code" });
  }

  const prompt = `You are a debugging assistant specialized in React and TypeScript. A developer pasted this error and code snippet. Respond ONLY in JSON, no markdown fences, no preamble, with this exact shape:
{
  "diagnosis": "one or two sentence plain-English explanation of the root cause",
  "fix": "the corrected code snippet only",
  "explanation": "2-3 sentences on why this fixes it and how to avoid it in the future"
}

ERROR:
${error}

CODE:
${code}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const textBlock = data.content.find((b) => b.type === "text");
    const cleaned = (textBlock?.text || "").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}
