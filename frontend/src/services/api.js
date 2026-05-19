/**
 * MedTrack Pro – API Service
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data;
}

export const auth = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => Promise.resolve(),
};

export const medications = {
  list: (userId) => {
    const query = userId ? `?userId=${userId}` : "";
    return request(`/medicines${query}`);
  },
  get: (id) => request(`/medicines/${id}`),
  create: (data) =>
    request("/medicines", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/medicines/${id}`, { method: "DELETE" }),
  refill: (id, addStock = 30) =>
    request(`/medicines/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ addStock }),
    }),
};

export const schedule = {
  get: (userId, from, to) => {
    const params = new URLSearchParams({ userId });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return request(`/schedule?${params}`);
  },
};

export const logs = {
  mark: (reminderId, status = "Alındı", date) =>
    request("/logs", {
      method: "POST",
      body: JSON.stringify({ reminderId, status, date }),
    }),
  unmark: (reminderId, date) =>
    request("/logs/today", {
      method: "DELETE",
      body: JSON.stringify({ reminderId, date }),
    }),
  unmarkToday: (reminderId) =>
    request("/logs/today", {
      method: "DELETE",
      body: JSON.stringify({ reminderId }),
    }),
};

export const dashboard = {
  get: (userId) => request(`/dashboard?userId=${userId}`),
};

export const reports = {
  adherence: (userId, days = 30) =>
    request(`/reports/adherence?userId=${userId}&days=${days}`),
  daily: (userId) => request(`/reports/daily?userId=${userId}`),
};

export const login = (email, password) => auth.login(email, password);
export const register = (data) => auth.register(data);
export const getMedicines = (userId) => medications.list(userId);
export const addMedicine = (data) => medications.create(data);
export const deleteMedicine = (id) => medications.delete(id);
export const checkHealth = () => request("/health");
