import request from "./client";

export async function getAdminStats() {
  return request("/admin/stats");
}

export async function getAdminOrders() {
  return request("/admin/orders");
}

export async function updateOrderStatus(id, status) {
  return request(`/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(product) {
  return request("/admin/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
  });
}