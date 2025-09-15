// const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;
// const APPSCRIPT_SECRET = import.meta.env.VITE_APPSCRIPT_SECRET;
//
// export async function uploadPhotos(photos, setProgress, setStatus, setPhotos) {
//   if (!photos.length) return;
//
//   setProgress(0);
//   setStatus("Uploading...");
//
//   const total = photos.length;
//   let completed = 0;
//
//   await Promise.all(
//     photos.map(async (photo) => {
//       try {
//         const endpoint =
//           window.location.hostname === "localhost"
//             ? UPLOAD_URL // for Google Drive dev
//             : "/.netlify/functions/upload-cloudinary"; // for Cloudinary prod
//
//         await fetch(endpoint, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             filename: photo.filename,
//             base64: photo.preview,
//             secret: APPSCRIPT_SECRET, // not needed for Cloudinary, but harmless
//           }),
//         });
//       } catch (err) {
//         console.error("Upload error:", err);
//       } finally {
//         completed++;
//         setProgress(Math.round((completed / total) * 100));
//       }
//     })
//   );
//
//   setStatus("Upload complete! 🎉");
//   setPhotos([]); // clear after upload
// }


const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL;
const APPSCRIPT_SECRET = import.meta.env.VITE_APPSCRIPT_SECRET;

export async function uploadPhotos(photos, setProgress, setStatus, setPhotos) {
  if (!photos.length) return;

  setProgress(0);
  setStatus("Uploading...");

  const total = photos.length;
  let completed = 0;

  await Promise.all(
    photos.map(async (photo) => {
      try {
        const endpoint =
          window.location.hostname === "localhost"
            ? UPLOAD_URL // Google Drive dev
            : "/.netlify/functions/upload-cloudinary"; // Cloudinary prod

        // ✅ Strip filename when sending to Cloudinary
        const payload =
          window.location.hostname === "localhost"
            ? { filename: photo.filename, base64: photo.preview, secret: APPSCRIPT_SECRET }
            : { base64: photo.preview };

        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        completed++;
        setProgress(Math.round((completed / total) * 100));
      }
    })
  );

  setStatus("Upload complete! 🎉");
  setPhotos([]); // clear after upload
}
