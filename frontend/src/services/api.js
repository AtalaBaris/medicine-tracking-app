/**
 * MedTrack Pro – API Service (backend entegrasyonu)
 * Backend: http://localhost:3000/api
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

// ── Auth ──────────────────────────────────────────────────────
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

// ── Medications (backend: /medicines) ───────────────────────
export const medications = {
  list: (userId) => {
    const query = userId ? `?userId=${userId}` : "";
    return request(`/medicines${query}`);
  },
  create: (data) =>
    request("/medicines", { method: "POST", body: JSON.stringify(data) }),
  delete: (id) => request(`/medicines/${id}`, { method: "DELETE" }),
};

// ── Reports (henüz backend yok) ─────────────────────────────
export const reports = {
  adherence: () => Promise.reject(new Error("Henüz uygulanmadı")),
  daily: () => Promise.reject(new Error("Henüz uygulanmadı")),
};

// Geriye dönük exportlar
export const login = (email, password) => auth.login(email, password);
export const register = (data) => auth.register(data);
export const getMedicines = (userId) => medications.list(userId);
export const addMedicine = (data) => medications.create(data);
export const deleteMedicine = (id) => medications.delete(id);
export const checkHealth = () => request("/health");
