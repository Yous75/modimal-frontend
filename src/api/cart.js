import request from "./client";

export async function getCart() {
  return request("/cart");
}

export async function addToCart({ productId, size, color, qty }) {
  return request("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, size, color, qty }),
  });
}

export async function removeFromCart(productId) {
  return request(`/cart/${productId}`, {
    method: "DELETE",
  });
}