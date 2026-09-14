import request from "./client";

// Submits the Contact Us form to the backend (routes/contactRoutes.js ->
// services/contactService.js -> models/ContactMessage.js).
export async function submitContactMessage({ fullName, email, subject, orderNumber, message }) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify({ fullName, email, subject, orderNumber, message }),
  });
}
