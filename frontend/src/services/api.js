const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Bir hata oluştu.");
  }

  return data;
}

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const getMedicines = (userId) => {
  const query = userId ? `?userId=${userId}` : "";
  return request(`/medicines${query}`);
};

export const addMedicine = (medicineData) =>
  request("/medicines", {
    method: "POST",
    body: JSON.stringify(medicineData),
  });

export const deleteMedicine = (id) =>
  request(`/medicines/${id}`, { method: "DELETE" });

export const checkHealth = () => request("/health");
