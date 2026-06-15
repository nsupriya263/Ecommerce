// src/services/api.js
// API calls — uses relative /api path on Vercel, fallback for local dev

const BASE_URL = process.env.REACT_APP_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Products ──────────────────────────────────────────────
export const fetchProducts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
};

export const fetchProduct = (id) => request(`/products/${id}`);
export const fetchCategories = () => request("/categories");

// ── Auth (Supabase via backend) ───────────────────────────
export const signUp = (email, password, name) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

export const signIn = async (email, password) => {
  const data = await request("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return request("/auth/signout", { method: "POST" });
};

// ── Orders ────────────────────────────────────────────────
export const placeOrder = (items, shippingAddress) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress }),
  });

export const fetchOrders = () => request("/orders");

// ── Wishlist ──────────────────────────────────────────────
export const fetchWishlist = () => request("/wishlist");
export const toggleWishlistApi = (productId) =>
  request(`/wishlist/${productId}`, { method: "POST" });
