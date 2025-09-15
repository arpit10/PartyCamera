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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // unsigned preset
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Send base64 directly to Cloudinary
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file: base64, // already has data:image/jpeg;base64 prefix
        upload_preset: uploadPreset,
      }),
    });

    const data = await res.json();

    if (data.error) {
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
