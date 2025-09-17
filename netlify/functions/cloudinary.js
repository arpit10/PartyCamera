export async function uploadToCloudinary(photo) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Ensure correct prefix
  let fileData = photo.preview;
  if (!fileData.startsWith("data:image")) {
    fileData = `data:image/jpeg;base64,${fileData}`;
  }

  const formData = new FormData();
  formData.append("file", fileData);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function fetchCloudinaryImages() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  // fetch list using Cloudinary's "list resources by tag/preset" API
  const url = `https://res.cloudinary.com/${cloudName}/image/list/GenderRevelParty.json`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Error fetching gallery:", res.status);
    return [];
  }
  const data = await res.json();
  return data.resources || [];
}
