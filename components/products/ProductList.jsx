"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import { fetchProducts, searchProducts, fetchCategories, deleteProduct } from "@/services/productApi";
import { parsePage, parsePageSize, clampPage } from "@/utils/urlParams";

import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
import Pagination from "./Pagination";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";

export default function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ----- URL is the single source of truth for all of these -----
  const page = parsePage(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const abortRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0); // bumped by the Retry button

  // Push a partial set of query params into the URL, dropping defaults so
  // the URL stays clean (e.g. no "?page=1&pageSize=10" on a fresh visit).
  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        const isDefault =
          value === "" ||
          value === undefined ||
          value === null ||
          (key === "page" && Number(value) === 1) ||
          (key === "pageSize" && Number(value) === 10) ||
          (key === "order" && value === "asc" && !params.get("sortBy") && !updates.sortBy);

        if (isDefault) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Load the category list once.
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([])); // non-critical - filter just stays empty
  }, []);

  // Load products whenever any relevant URL param (or the retry key) changes.
  useEffect(() => {
    const controller = new AbortController();
    // Cancel whatever request is still in flight so a slow older response
    // can never overwrite a newer one (this is what the &delay=2000 test checks).
    abortRef.current?.abort();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    const skip = (page - 1) * pageSize;

    const request = search
      ? searchProducts({ q: search, limit: pageSize, skip, sortBy, order, signal: controller.signal })
      : fetchProducts({ limit: pageSize, skip, sortBy, order, category, signal: controller.signal });

    request
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);

        // Guard against ?page=999 pointing past the last real page once we
        // know the true total.
        const safePage = clampPage(page, pageSize, data.total);
        if (safePage !== page) {
          updateParams({ page: safePage });
        }
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return; // stale request - ignore
        setError(err.friendlyMessage || "Failed to load products.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, category, sortBy, order, reloadKey]);

  function handleSearchChange(newSearch) {
    updateParams({ search: newSearch, page: 1 });
  }

  function handleCategoryChange(newCategory) {
    updateParams({ category: newCategory, page: 1 });
  }

  function handleSortChange({ sortBy: newSortBy, order: newOrder }) {
    updateParams({ sortBy: newSortBy, order: newOrder });
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage });
  }

  function handlePageSizeChange(newSize) {
    updateParams({ pageSize: newSize, page: 1 });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      // DummyJSON doesn't actually persist the delete, so we remove the
      // row from local state ourselves to make the UI behave as if it did.
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.friendlyMessage || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={handleSearchChange} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={handleCategoryChange}
            disabled={Boolean(search)}
          />
          <SortSelect sortBy={sortBy} order={order} onChange={handleSortChange} />
        </div>
      </div>

      {search && (
        <p className="text-xs text-slate-400">
          Category filter is ignored while a search is active (DummyJSON can&apos;t combine both) - see README.
        </p>
      )}

      {loading ? (
        <Loader label="Loading products..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found."
          description={search ? `No results for "${search}".` : "Try a different filter."}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <ProductTable products={products} onDelete={setDeleteTarget} />
          </div>
          <div className="space-y-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onDelete={setDeleteTarget} />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      <DeleteConfirmModal
        product={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
