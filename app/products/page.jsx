import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import ProductList from "@/components/products/ProductList";
import Loader from "@/components/common/Loader";

export const metadata = { title: "Products - Product Admin" };

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-ink">Products</h1>
          <Link
            href="/products/new"
            className="rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            Add product
          </Link>
        </div>

        {/* useSearchParams() inside ProductList requires a Suspense boundary. */}
        <Suspense fallback={<Loader label="Loading products..." />}>
          <ProductList />
        </Suspense>
      </main>
    </>
  );
}
