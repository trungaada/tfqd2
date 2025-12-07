export default async function handler(req, res) {
  // ✅ Chặn GET, chỉ cho POST
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

    // ✅ Chống crash nếu API lỗi
    if (!data.choices) {
      return res.status(500).json({
        error: "OpenAI API error",
        detail: data
      });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({
      error: "Server crashed",
      detail: err.message
    });
  }
}
