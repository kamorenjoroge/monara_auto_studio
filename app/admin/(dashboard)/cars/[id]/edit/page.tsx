import { Suspense } from "react";

import CarFormScreen from "../../CarFormScreen";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

// Save this file as app/admin/(dashboard)/cars/[id]/edit/page.tsx
// (the folder must be named [id], with the square brackets)

// STEP A: the page does NOT read the address itself, it only shows a placeholder while loading.
export default function EditCarPage({ params }: EditCarPageProps) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
      <EditCar params={params} />
    </Suspense>
  );
}

// STEP B: read the id from the web address and hand it to the form screen.
async function EditCar({ params }: EditCarPageProps) {
  const { id } = await params;
  return <CarFormScreen carId={id} />;
}