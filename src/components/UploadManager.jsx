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


export async function uploadPhotos(photos, setProgress, setStatus, setPhotos) {
  if (!photos.length) return;

  setProgress(0);
  setStatus("Uploading...");

  const total = photos.length;
  let completed = 0;

  await Promise.all(
    photos.map(async (photo) => {
      try {
        const isLocal = window.location.hostname === "localhost";
        const endpoint = isLocal
          ? UPLOAD_URL // Google Drive dev
          : "/.netlify/functions/upload-cloudinary"; // Cloudinary prod

        let payload;
        let headers;

        if (isLocal) {
          // Google Drive flow = JSON
          payload = JSON.stringify({
            filename: photo.filename,
            base64: photo.preview,
            secret: APPSCRIPT_SECRET,
          });
          headers = { "Content-Type": "application/json" };
        } else {
          // Cloudinary flow = JSON with ONLY base64 (function will repackage)
          payload = JSON.stringify({ base64: photo.preview });
          headers = { "Content-Type": "application/json" };
        }

        await fetch(endpoint, {
          method: "POST",
          headers,
          body: payload,
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
