import request from "./client";

// Creates a new order after the customer completes checkout.
export async function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// Gets the orders belonging to the currently logged-in customer.
export async function getOrders() {
  return request("/orders");
}

// Gets one specific order by its MongoDB ID.
export async function getOrder(id) {
  return request(`/orders/${id}`);
}