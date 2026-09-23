"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import ProductForm from "@/components/products/ProductForm";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import { fetchProductById, updateProduct, deleteProduct } from "@/services/productApi";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "1");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setNotFound(false);

    fetchProductById(id, controller.signal)
      .then(setProduct)
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.friendlyMessage || "Failed to load this product.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  async function handleUpdate(values) {
    const updated = await updateProduct(id, values);
    // DummyJSON doesn't persist the change, so merge the response into
    // local state to make the UI reflect the edit right away.
    setProduct((prev) => ({ ...prev, ...updated }));
    setIsEditing(false);
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteProduct(id);
      router.push("/products");
    } catch (err) {
      setError(err.friendlyMessage || "Failed to delete product.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Link href="/products" className="mb-4 inline-block text-sm text-brand-600 hover:text-brand-700">
          &larr; Back to products
        </Link>

        {loading ? (
          <Loader label="Loading product..." />
        ) : notFound ? (
          <EmptyState
            title="Product not found"
            description={`There's no product with id "${id}".`}
            action={
              <Link href="/products" className="text-sm font-medium text-brand-600">
                Go back to products
              </Link>
            }
          />
        ) : error ? (
          <ErrorState message={error} onRetry={() => router.refresh()} />
        ) : isEditing ? (
          <div>
            <h1 className="mb-4 text-lg font-semibold text-ink">Edit product</h1>
            <ProductForm initialValues={product} onSubmit={handleUpdate} submitLabel="Save changes" />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-3 text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          product && (
            <div>
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-shrink-0">
                  <Image
                    src={product.images?.[0] || product.thumbnail}
                    alt={product.title}
                    width={220}
                    height={220}
                    className="rounded-lg border border-slate-200 object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-ink">{product.title}</h1>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {product.category} {product.brand ? `- ${product.brand}` : ""}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-ink">${product.price}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    ★ {product.rating} · {product.stock} in stock
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <section className="mt-10">
                <h2 className="mb-3 text-sm font-semibold text-ink">Reviews</h2>
                {!product.reviews || product.reviews.length === 0 ? (
                  <p className="text-sm text-slate-500">No reviews yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {product.reviews.map((review, idx) => (
                      <li key={idx} className="rounded-lg border border-slate-200 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-ink">{review.reviewerName}</span>
                          <span className="text-xs text-slate-400">★ {review.rating}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )
        )}

        <DeleteConfirmModal
          product={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </>
  );
}
