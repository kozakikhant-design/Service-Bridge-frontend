const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("servicebridge_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }
  return data;
}


export const api = {
  health: () => request("/health"),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  updateUser: (id, body) => request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  categories: () => request("/categories"),
  providers: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));
    return request(`/providers${query.toString() ? `?${query}` : ""}`);
  },
  provider: (id) => request(`/providers/${id}`),
  myProvider: () => request("/providers/me"),
  createProvider: (body) => request("/providers", { method: "POST", body: JSON.stringify(body) }),
  updateProvider: (id, body) => request(`/providers/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  services: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== ""));
    return request(`/services${query.toString() ? `?${query}` : ""}`);
  },
  createService: (body) => request("/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id, body) => request(`/services/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteService: (id) => request(`/services/${id}`, { method: "DELETE" }),
  favorites: () => request("/favorites"),
  addFavorite: (providerId) => request(`/favorites/${providerId}`, { method: "POST" }),
  removeFavorite: (providerId) => request(`/favorites/${providerId}`, { method: "DELETE" }),
  bookings: () => request("/bookings"),
  createBooking: (body) => request("/bookings", { method: "POST", body: JSON.stringify(body) }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  adminStats: () => request("/admin/stats"),
  pendingProviders: () => request("/admin/providers/pending"),
  verifyProvider: (id, verified) => request(`/admin/providers/${id}/verify`, { method: "PATCH", body: JSON.stringify({ verified }) }),
  pendingServices: () => request("/admin/services/pending"),
  reviewService: (id, status, rejectionReason = "") => request(`/admin/services/${id}/review`, { method: "PATCH", body: JSON.stringify({ status, rejectionReason }) }),
};

export function setSession(token, user) {
  localStorage.setItem("servicebridge_token", token);
  localStorage.setItem("servicebridge_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("servicebridge_token");
  localStorage.removeItem("servicebridge_user");
}
