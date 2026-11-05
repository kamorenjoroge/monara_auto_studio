'use server';

import { updateTag } from "next/cache";

// The names of the remembered (cached) public data. Each is set with cacheTag(...) in the data code.
const ALLOWED_TAGS = ["site-settings", "services", "packages", "products", "gallery", "cars"];

// Called by the admin pages right after a change is saved, so the public website
// shows the new data straight away instead of waiting for its short memory to expire.
// It only clears the website's memory (it cannot read or change any data), so it is safe to call.
export async function refreshPublic(tag: string) {
  if (ALLOWED_TAGS.includes(tag)) {
    updateTag(tag);
  }
}