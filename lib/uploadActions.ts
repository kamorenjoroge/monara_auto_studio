'use server';

import { createHash } from "crypto";

import { createClient } from "./supabase/server";

// Which Cloudinary folders the website may upload into
const ALLOWED_FOLDERS = ["cars", "services", "packages", "products", "gallery"];
const ALLOWED_FORMATS = "jpg,jpeg,png,webp";

// The result is either an error message, or everything the browser needs to upload ONE image.
type UploadSignature =
  | { error: string }
  | {
      cloudName: string;
      apiKey: string;
      timestamp: number;
      folder: string;
      allowedFormats: string;
      signature: string;
    };

// Runs on the SERVER. It checks that the person is a logged-in, active admin or seller,
// then signs the upload request with the secret key. The secret key never leaves the server,
// and a signature works for one upload for a short time only.
// Save this file as lib/uploadActions.ts
export async function getUploadSignature(folder: string): Promise<UploadSignature> {
  // 1. Who is asking?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in again, then try the upload." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.active) return { error: "Your account cannot upload images." };

  // 2. Is this person allowed to upload here? Sellers may only upload car photos.
  if (!ALLOWED_FOLDERS.includes(folder)) return { error: "Unknown upload folder." };
  if (profile.role !== "admin" && folder !== "cars") {
    return { error: "You can only upload car photos." };
  }

  // 3. Are the Cloudinary keys set?
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { error: "Image uploads are not set up yet (the Cloudinary keys are missing)." };
  }

  // 4. Sign the request. Cloudinary's rule: sort the parameters by name, join them as
  //    name=value&name=value, add the secret at the end, and take the SHA-1 hash.
  const timestamp = Math.round(Date.now() / 1000);
  const cloudinaryFolder = `monara/${folder}`;
  const textToSign = `allowed_formats=${ALLOWED_FORMATS}&folder=${cloudinaryFolder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(textToSign + apiSecret)
    .digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    folder: cloudinaryFolder,
    allowedFormats: ALLOWED_FORMATS,
    signature,
  };
}