import { Suspense } from "react";

import SellerFormScreen from "../../SellerFormScreen";

interface EditSellerPageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/sellers/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditSellerPage({ params }: EditSellerPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditSeller params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditSeller({ params }: EditSellerPageProps) {
  const { id } = await params;
  return <SellerFormScreen sellerId={id} />;
}