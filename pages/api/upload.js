import fs from "fs";
import path from "path";
import { withAuth } from "../../lib/auth"; // ✅ fixed import path

export const config = {
  api: { bodyParser: false },
};

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));

  req.on("end", () => {
    try {
      // --- Parse JSON body ---
      const { filename, data } = JSON.parse(raw || "{}");
      if (!filename || !data) {
        return res
          .status(400)
          .json({ ok: false, error: "Missing filename or data" });
      }

      // --- Validate data URL format ---
      const matches = data.match(/^data:(.*);base64,(.*)$/);
      if (!matches) {
        return res
          .status(400)
          .json({ ok: false, error: "Invalid data URL format" });
      }

      const mime = matches[1];
      const base64 = matches[2];
      const buffer = Buffer.from(base64, "base64");

      // --- Security: Size limit ---
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (buffer.length > MAX_SIZE) {
        return res
          .status(400)
          .json({ ok: false, error: "File too large (max 5MB)" });
      }

      // --- Extract extension BEFORE using it ---
      const ext = path.extname(filename).toLowerCase();
      const base = path.basename(filename, ext).replace(/[^a-z0-9_\-]/gi, "_");

      // --- Allowed file types (with Excel support) ---
      const ALLOWED_MIME = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv", // .csv
      ];

      const ALLOWED_EXT = [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".xlsx",
        ".xls",
        ".csv",
      ];

      if (!ALLOWED_MIME.includes(mime) || !ALLOWED_EXT.includes(ext)) {
        return res
          .status(400)
          .json({ ok: false, error: "Unsupported file type" });
      }

      // --- Sanitize filename and write ---
      const safeFilename = `${base}_${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const finalPath = path.join(uploadDir, safeFilename);
      fs.writeFileSync(finalPath, buffer);

      // --- Success response ---
      return res.status(200).json({
        ok: true,
        url: `/uploads/${safeFilename}`,
        filename: safeFilename,
        mime,
        uploadedBy: req.user?.username || "unknown",
      });
    } catch (err) {
      console.error("Upload error:", err);
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ ok: false, error: "Server error while uploading" });
      }
    }
  });

  // --- Safety fallback for stream errors ---
  req.on("error", (err) => {
    console.error("Stream error:", err);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: "Request stream error" });
    }
  });
}

// 🔒 Wrap your handler with authentication middleware
export default withAuth(handler);
