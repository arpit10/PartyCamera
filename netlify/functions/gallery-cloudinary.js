
export async function handler() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: "folder:party-photos/*", // 👈 match everything in that folder
        max_results: 50,
        sort_by: [{ public_id: "desc" }],
      }),
    });

    if (!res.ok) {
      throw new Error(`Cloudinary fetch failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.resources || []),
    };
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
