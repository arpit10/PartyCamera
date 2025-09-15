export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { base64 } = body;

    if (!base64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing base64 image data" }),
      };
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // ✅ Use URL-encoded form body instead of JSON
    const formBody = new URLSearchParams();
    formBody.append("file", base64); // base64 string with prefix
    formBody.append("upload_preset", uploadPreset);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    const data = await res.json();

    if (data.error) {
      console.error("Cloudinary error:", data.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Upload failed", details: err.message }),
    };
  }
}
