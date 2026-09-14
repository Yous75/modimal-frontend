const BASE_URL = import.meta.env.VITE_API_URL;

// Every other file in this folder calls this function instead of using
// fetch() directly. It takes care of three things in one place:
//   1. adding the backend's base URL to whatever path you pass in
//   2. attaching your saved login token, if you have one
//   3. turning a failed request (like a 400 or 401) into a real thrown
//      Error, since fetch() does NOT do this on its own
async function request(path, options = {}) {
  const token = localStorage.getItem("modimal_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Some responses (like a failed DELETE) might not have a JSON body —
  // this just avoids crashing if that happens.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }

  return data;
}

export default request;