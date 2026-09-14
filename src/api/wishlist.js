import request from "./client";

export async function getWishlist() {
  return request("/wishlist");
}

export async function addToWishlist(productId) {
  return request(`/wishlist/${productId}`, {
    method: "POST",
  });
}

export async function removeFromWishlist(productId) {
  return request(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}