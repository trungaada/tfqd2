export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const contentType = req.headers["content-type"] || "";

    // Lấy tên file từ multipart/form-data
    const match = contentType.match(/filename="(.+?)"/);
    const filename = match ? match[1] : "unknown.bin";

    res.status(200).json({
      success: true,
      filename,
      size: buffer.length,
      reply: `📁 Đã upload thành công file: ${filename}`
    });

  } catch (err) {
    res.status(500).json({
      error: "Upload failed",
      detail: String(err)
    });
  }
}
