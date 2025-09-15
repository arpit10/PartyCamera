// netlify/functions/upload.js
export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    const response = await fetch(process.env.APPSCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: body.filename,
        base64: body.base64,
        secret: process.env.APPSCRIPT_SECRET || "", // optional validation
      }),
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*", // allow frontend
        "Content-Type": "application/json",
      },
      body: text,
    };
  } catch (error) {
    console.error("Upload function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
