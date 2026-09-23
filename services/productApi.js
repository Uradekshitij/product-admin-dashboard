import { api } from "./api";

// All product-related HTTP calls live here. Every function accepts an
// optional AbortController `signal` so callers (mainly the search box) can
// cancel an in-flight request when a newer one starts.

/**
 * Plain paginated list, used when there is no search term.
 * DummyJSON supports category filtering OR search, not both at once -
 * this function handles the "list" and "list by category" cases.
 */
export async function fetchProducts({ limit, skip, sortBy, order, category, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }

  const url = category
    ? `/products/category/${encodeURIComponent(category)}`
    : "/products";

  const response = await api.get(url, { params, signal });
  return response.data; // { products, total, skip, limit }
}

/**
 * Search endpoint. DummyJSON's /products/search does not support the
 * `category` filter, so when a search term is active we search across
 * all products (see README for why this trade-off was chosen).
 */
export async function searchProducts({ q, limit, skip, sortBy, order, signal }) {
  const params = { q, limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const response = await api.get("/products/search", { params, signal });
  return response.data;
}

export async function fetchCategories(signal) {
  const response = await api.get("/products/categories", { signal });
  // DummyJSON returns an array of { slug, name, url } objects.
  return response.data;
}

export async function fetchProductById(id, signal) {
  const response = await api.get(`/products/${id}`, { signal });
  return response.data;
}

export async function createProduct(payload) {
  const response = await api.post("/products/add", payload);
  return response.data;
}

export async function updateProduct(id, payload) {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
