export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    console.log("📥 Incoming body:", Object.keys(body));

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

    // ✅ Strip the prefix completely
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");

    // ✅ Send only the raw base64, without re-adding the prefix
    const formBody = new URLSearchParams();
    formBody.append("file", base64Data);
    formBody.append("upload_preset", uploadPreset);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    });

    console.log("res = ", res);
    console.log("body = ", formBody.toString())

    const data = await res.json();
    console.log("data = ", data)
    if (data.error) {
      console.error("❌ Cloudinary error:", data.error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message }),
      };
    }

    console.log("✅ Upload success:", {
      public_id: data.public_id,
      secure_url: data.secure_url,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("💥 Upload error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Upload failed", details: err.message }),
    };
  }
}
