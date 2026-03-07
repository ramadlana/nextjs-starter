import fs from "fs";
import path from "path";
import { withAuth } from "../../lib/auth"; // ✅ fixed import path

export const config = {
  api: { bodyParser: false },
};

const UPLOAD_TIMEOUT_MS = 30_000; // 30s

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const contentLength = parseInt(req.headers["content-length"], 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_SIZE) {
    return res.status(413).json({ ok: false, error: "Request body too large (max 5MB)" });
  }

  let responded = false;
  function sendResponse(status, body) {
    if (responded) return;
    responded = true;
    res.status(status).json(body);
  }

  const timeout = setTimeout(() => {
    if (responded) return;
    responded = true;
    req.destroy();
    res.status(408).json({ ok: false, error: "Request timeout" });
  }, UPLOAD_TIMEOUT_MS);

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));

  req.on("end", () => {
    clearTimeout(timeout);
    if (responded) return;
    try {
      // --- Parse JSON body ---
      const { filename, data } = JSON.parse(raw || "{}");
      if (!filename || !data) {
        return sendResponse(400, {
          ok: false,
          error: "Missing filename or data",
        });
      }

      // --- Validate data URL format ---
      const matches = data.match(/^data:(.*);base64,(.*)$/);
      if (!matches) {
        return sendResponse(400, {
          ok: false,
          error: "Invalid data URL format",
        });
      }

      const mime = matches[1];
      const base64 = matches[2];
      const buffer = Buffer.from(base64, "base64");

      // --- Security: Size limit ---
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (buffer.length > MAX_SIZE) {
        return sendResponse(400, {
          ok: false,
          error: "File too large (max 5MB)",
        });
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
        return sendResponse(400, {
          ok: false,
          error: "Unsupported file type",
        });
      }

      // --- Sanitize filename and write (outside public/ for access control) ---
      const safeFilename = `${base}_${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const finalPath = path.join(uploadDir, safeFilename);
      fs.writeFileSync(finalPath, buffer);

      // --- Success response (served via protected /api/uploads/[filename]) ---
      return sendResponse(200, {
        ok: true,
        url: `/api/uploads/${safeFilename}`,
        filename: safeFilename,
        mime,
        uploadedBy: req.user?.username || "unknown",
      });
    } catch (err) {
      console.error("Upload error:", err);
      sendResponse(500, { ok: false, error: "Server error while uploading" });
    }
  });

  req.on("error", (err) => {
    clearTimeout(timeout);
    console.error("Stream error:", err);
    sendResponse(500, { ok: false, error: "Request stream error" });
  });
}

// 🔒 Wrap your handler with authentication middleware
export default withAuth(handler);
