"use client";

import ErrorState from "@/components/common/ErrorState";

// Catches any render-time error thrown under /products that ProductList's
// own try/catch didn't handle (e.g. a bug, not a failed API call).
export default function ProductsError({ error, reset }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <ErrorState
        message={error?.message || "Something went wrong loading products."}
        onRetry={reset}
      />
    </main>
  );
}
