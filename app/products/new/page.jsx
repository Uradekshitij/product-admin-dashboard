"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "@/services/productApi";

export default function NewProductPage() {
  const router = useRouter();

  async function handleCreate(values) {
    // DummyJSON accepts the POST and echoes back a product with a new id,
    // but it isn't actually persisted. We still send it for real so the
    // response shape matches what a real backend would return.
    await createProduct(values);
    router.push("/products");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-6 sm:px-6">
        <h1 className="mb-1 text-lg font-semibold text-ink">Add product</h1>
        <p className="mb-6 text-sm text-slate-500">
          Note: DummyJSON doesn&apos;t actually save new products - this confirms the request works and returns you to the list.
        </p>
        <ProductForm onSubmit={handleCreate} submitLabel="Add product" />
      </main>
    </>
  );
}
