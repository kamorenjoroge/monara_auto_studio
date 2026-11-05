import { getUploadSignature } from "./uploadActions";

export const MAX_IMAGE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Checks a chosen file BEFORE anything is sent. Returns a message if it is not acceptable, otherwise null.
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" is not a JPG, PNG or WebP image.`;
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `"${file.name}" is bigger than ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}

// Uploads ONE image from the user's device to Cloudinary and returns its link.
// Use it in the browser. `folder` is one of: cars, services, packages, products, gallery.
// Save this file as lib/uploadImage.ts
//
//   const result = await uploadImage(file, "services");
//   if (result.url) { ...save result.url in the database... } else { ...show result.error... }
export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url?: string; error?: string }> {
  const problem = validateImageFile(file);
  if (problem) return { error: problem };

  // Ask our server for permission (a signed ticket for one upload)
  const ticket = await getUploadSignature(folder);
  if ("error" in ticket) return { error: ticket.error };

  // Send the image straight from the browser to Cloudinary
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", ticket.apiKey);
  form.append("timestamp", String(ticket.timestamp));
  form.append("signature", ticket.signature);
  form.append("folder", ticket.folder);
  form.append("allowed_formats", ticket.allowedFormats);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${ticket.cloudName}/image/upload`, {
      method: "POST",
      body: form,
    });
    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      return { error: data?.error?.message ?? "The upload failed. Please try again." };
    }
    return { url: data.secure_url as string };
  } catch {
    return { error: "The upload failed. Check your internet connection and try again." };
  }
}