import { Suspense } from "react";

import ServiceFormScreen from "../../ServiceFormScreen";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/services/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditServicePage({ params }: EditServicePageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditService params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditService({ params }: EditServicePageProps) {
  const { id } = await params;
  return <ServiceFormScreen serviceId={id} />;
}