// What visitors see for a moment while a public page is loading its data.
// Next.js puts this file around every page in the (site) group automatically,
// so clicking a link shows this at once instead of waiting for the database.
// Save this file as app/(site)/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-10 w-2/3 max-w-xl animate-pulse rounded bg-muted" />
      <div className="mt-3 h-1 w-20 animate-pulse rounded-full bg-muted" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="hidden h-64 animate-pulse rounded-2xl bg-muted lg:block" />
      </div>
    </div>
  );
}