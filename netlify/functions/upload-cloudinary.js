import fetch from "node-fetch";
import FormData from "form-data";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const { filename, base64 } = body;
    if (!filename || !base64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing filename or base64" }),
      };
    }

    // Prepare Cloudinary upload API
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // unsigned preset
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Strip base64 prefix
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");

    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64Data}`);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Upload failed" }),
    };
  }
}
