// netlify/functions/gallery-cloudinary.js
import fetch from "node-fetch";

export async function handler() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    // List recent images (max 30) - only "unsigned uploads" will show if preset is used
    const url = `https://res.cloudinary.com/${cloudName}/image/list/${uploadPreset}.json`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Cloudinary fetch failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.resources || []), // array of images
    };
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
