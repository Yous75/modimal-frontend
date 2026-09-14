import request from "./client";

// filters can include { category, search }. Empty/undefined values are
// left out of the URL instead of showing up as "?category=undefined".
export async function getProducts(filters = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== "")
  );
  const query = new URLSearchParams(cleaned).toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export async function getProduct(id) {
  return request(`/products/${id}`);
}