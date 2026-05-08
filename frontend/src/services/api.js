const API_URL = "http://localhost:3000/api";

// Tüm ilaçları getir
export const getMedicines = async () => {
  const response = await fetch(`${API_URL}/medicines`);
  return response.json();
};

// Yeni ilaç ekle
export const addMedicine = async (medicineData) => {
  const response = await fetch(`${API_URL}/medicines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(medicineData),
  });
  return response.json();
};

// İlaç sil
export const deleteMedicine = async (id) => {
  const response = await fetch(`${API_URL}/medicines/${id}`, {
    method: "DELETE",
  });
  return response.json();
};
