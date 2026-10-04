import { auth } from "../firebase/config";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export async function uploadStudentImage(studentId, file) {
  if (!cloudName || !uploadPreset || uploadPreset === "your-unsigned-upload-preset") {
    const error = new Error("Set VITE_CLOUDINARY_UPLOAD_PRESET to a real unsigned preset name.");
    error.code = "cloudinary/missing-config";
    throw error;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "students");
  formData.append("public_id", `${studentId}_${Date.now()}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData, signal: controller.signal },
    );
    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result.error?.message || "Cloudinary upload failed.");
      error.code = "cloudinary/upload-failed";
      throw error;
    }

    if (!result.secure_url || !result.public_id) {
      const error = new Error("Cloudinary returned no image URL.");
      error.code = "cloudinary/invalid-response";
      throw error;
    }

    return { imageUrl: result.secure_url, imagePublicId: result.public_id };
  } catch (error) {
    if (error.name === "AbortError") {
      error.code = "cloudinary/timeout";
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function deleteStudentImage(publicId) {
  if (!publicId || !publicId.startsWith("students/")) {
    throw new Error("Invalid student image public ID.");
  }
  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to delete an image.");

  const token = await user.getIdToken();
  const response = await fetch(`${apiUrl}/api/delete-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicId }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Unable to delete the old image.");
  }

  return result;
}