export default async function handler(req, res) {
  // ✅ FIX CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Trả về OK cho preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Chặn GET
  if (req.method !== "POST") {
    return res.status(200).send("Only POST allowed");
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await r.json();

    if (!data.choices) {
      return res.status(500).json({
        error: "OpenAI error",
        detail: data
      });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
