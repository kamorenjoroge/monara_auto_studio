import { Suspense } from "react";

import PackageFormScreen from "../../PackageFormScreen";

interface EditPackagePageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/packages/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditPackagePage({ params }: EditPackagePageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditPackage params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditPackage({ params }: EditPackagePageProps) {
  const { id } = await params;
  return <PackageFormScreen packageId={id} />;
}