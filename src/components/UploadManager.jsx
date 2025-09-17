// src/components/UploadManager.jsx
// Usage: import { uploadPhotos } from "./components/UploadManager.jsx";

const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL; // your local Apps Script proxy (dev)
const APPSCRIPT_SECRET = import.meta.env.VITE_APPSCRIPT_SECRET; // optional for dev
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// helper: sanitize filename (remove slashes)
function sanitizeFilename(name = "") {
  return name.toString().replace(/[\\/]+/g, "_").replace(/\s+/g, "_");
}

// helper: convert dataURL -> Blob (runs in browser)
function dataURLToBlob(dataURL) {
  const parts = dataURL.split(",");
  const meta = parts[0]; // e.g. "data:image/jpeg;base64"
  const base64 = parts[1];
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = (mimeMatch && mimeMatch[1]) || "image/jpeg";
  const byteString = atob(base64);
  const arr = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) arr[i] = byteString.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/**
 * Upload photos.
 * - photos: array of { preview: dataURL, filename: string, ... }
 * - setProgress(progressNumber 0..100)
 * - setStatus(string)
 * - setPhotos([]) to clear after upload
 */
export async function uploadPhotos(photos, setProgress, setStatus, setPhotos) {
  if (!photos || !photos.length) return;

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  setProgress(0);
  setStatus("Uploading...");
  let completed = 0;
  const total = photos.length;

  // optional: collect results
  const results = [];

  for (const photo of photos) {
    try {
      // sanFilename used when we create the File object
      const sanFilename = sanitizeFilename(photo.filename || `photo_${Date.now()}.jpg`);

      if (isLocal && UPLOAD_URL) {
        // DEV -> send to your Apps Script proxy (keep same behavior)
        const payload = {
          filename: sanFilename,
          base64: photo.preview,
          secret: APPSCRIPT_SECRET,
        };

        const res = await fetch(UPLOAD_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);
        results.push({ ok: res.ok, json });
      } else {
        // PROD -> upload DIRECTLY to Cloudinary using unsigned preset
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
          throw new Error("Missing Cloudinary configuration (VITE_CLOUDINARY_...)");
        }

        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        // Convert dataURL -> Blob -> File (so Cloudinary has original filename)
        const blob = dataURLToBlob(photo.preview);
        const file = new File([blob], sanFilename, { type: blob.type });

        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", UPLOAD_PRESET);

        // optional: put original filename into context or tags (no slashes)
        // fd.append("context", `filename=${encodeURIComponent(sanFilename)}`);

        const res = await fetch(url, {
          method: "POST",
          body: fd, // NOTE: do NOT set Content-Type header — browser will set boundary
        });

        const json = await res.json();
        if (json.error) throw new Error(json.error.message || JSON.stringify(json));
        results.push({ ok: true, json });
      }
    } catch (err) {
      console.error("Upload error:", err);
      // keep going — record the failure
      results.push({ ok: false, error: String(err) });
      // update user-visible status for a failed photo
      setStatus((s) => `Upload error: ${err.message || err}`);
    } finally {
      completed++;
      setProgress(Math.round((completed / total) * 100));
    }
  }

  // final status
  const anyFail = results.some((r) => !r.ok);
  if (anyFail) {
    setStatus("Upload finished with some errors (check console). Photos remain saved locally.");
  } else {
    setStatus("Upload complete! 🎉");
    // clear after a short delay so user sees 100%
    setTimeout(() => {
      setPhotos([]);
      setProgress(0);
    }, 500);
  }

  return results;
}
