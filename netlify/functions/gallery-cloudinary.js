// // netlify/functions/gallery-cloudinary.js
//
// export async function handler() {
//   try {
//     const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
//     const apiKey = process.env.CLOUDINARY_API_KEY;
//     const apiSecret = process.env.CLOUDINARY_API_SECRET;
//
//     // Admin API endpoint: list uploaded images
//     const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?max_results=30`;
//
//     const res = await fetch(url, {
//       headers: {
//         Authorization:
//           "Basic " + Buffer.from(apiKey + ":" + apiSecret).toString("base64"),
//       },
//     });
//
//     if (!res.ok) {
//       throw new Error(`Cloudinary fetch failed: ${res.status}`);
//     }
//
//     const data = await res.json();
//
//     return {
//       statusCode: 200,
//       body: JSON.stringify(data.resources || []),
//     };
//   } catch (err) {
//     console.error("Gallery fetch error:", err);
//     return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
//   }
// }

/* eslint-env node */

export async function handler() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?max_results=30`;
    console.log("URL = ", url)
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Cloudinary fetch failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.resources || []),
    };
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
