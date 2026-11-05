import { Suspense } from "react";

import ProductFormScreen from "../../ProductFormScreen";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/products/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditProduct({ params }: EditProductPageProps) {
  const { id } = await params;
  return <ProductFormScreen productId={id} />;
}