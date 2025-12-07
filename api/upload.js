export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const contentType = req.headers["content-type"] || "";

    // Lấy tên file từ header
    const filenameMatch = contentType.match(/filename="(.+?)"/);
    const filename = filenameMatch ? filenameMatch[1] : "unknown_file";

    // Trả về base64 (nếu cần gửi cho AI thì dùng cái này)
    const base64 = buffer.toString("base64");

    res.status(200).json({
      success: true,
      filename,
      size: buffer.length,
      base64: base64.substring(0, 200) + "...", 
      reply: "📁 File đã upload thành công!"
    });
  } catch (err) {
    res.status(500).json({
      error: "Upload failed",
      detail: String(err)
    });
  }
}
