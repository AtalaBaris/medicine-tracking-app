/**
 * MedTrack Pro – API Service
 *
 * Replace BASE_URL with your backend URL and implement
 * real fetch/axios calls per endpoint.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────
export const auth = {
  login:    (email, password)  => request("/auth/login",    { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data)             => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  logout:   ()                 => request("/auth/logout",   { method: "POST" }),
};

// ── Medications ───────────────────────────────────────────────
export const medications = {
  list:   ()     => request("/medications"),
  get:    (id)   => request(`/medications/${id}`),
  create: (data) => request("/medications",    { method: "POST",   body: JSON.stringify(data) }),
  update: (id, data) => request(`/medications/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  delete: (id)   => request(`/medications/${id}`,     { method: "DELETE" }),
};

// ── Reports ───────────────────────────────────────────────────
export const reports = {
  adherence: (from, to) => request(`/reports/adherence?from=${from}&to=${to}`),
  daily:     ()         => request("/reports/daily"),
};
