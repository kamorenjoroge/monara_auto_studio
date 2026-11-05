import { Suspense } from "react";

import GalleryFormScreen from "../../GalleryFormScreen";

interface EditGalleryItemPageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/gallery/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditGalleryItemPage({ params }: EditGalleryItemPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditGalleryItem params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditGalleryItem({ params }: EditGalleryItemPageProps) {
  const { id } = await params;
  return <GalleryFormScreen itemId={id} />;
}