import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedicines, addMedicine, deleteMedicine } from "../../services/api";
import { clearStoredUser, getStoredUser } from "../../utils/auth";

const FORMS = ["Tablet", "Kapsül", "Şurup", "İğne", "Damla"];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    dosage: "",
    form: "Tablet",
    time: "08:00",
    frequency: "",
    days: "",
    stockQuantity: 0,
  });

  const loadMedicines = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getMedicines(user.id);
      setMedicines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, [user?.id]);

  const handleLogout = () => {
    clearStoredUser();
    navigate("/login");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addMedicine({
        userId: user.id,
        name: medicineForm.name,
        dosage: medicineForm.dosage,
        form: medicineForm.form,
        time: medicineForm.time,
        frequency: medicineForm.frequency || null,
        days: medicineForm.days || null,
        stockQuantity: Number(medicineForm.stockQuantity) || 0,
      });
      setMedicineForm({
        name: "",
        dosage: "",
        form: "Tablet",
        time: "08:00",
        frequency: "",
        days: "",
        stockQuantity: 0,
      });
      await loadMedicines();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteMedicine(id);
      await loadMedicines();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">İlaç Takip Sistemi</h1>
          <p className="text-gray-500">Hoş geldin, {user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-600"
        >
          Çıkış Yap
        </button>
      </header>

      {error && (
        <p className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
          {error}
        </p>
      )}

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Yeni İlaç Ekle</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="İlaç adı"
            value={medicineForm.name}
            onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
            className="border rounded-lg px-3 py-2"
            required
          />
          <input
            placeholder="Dozaj (örn. 500mg)"
            value={medicineForm.dosage}
            onChange={(e) => setMedicineForm({ ...medicineForm, dosage: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={medicineForm.form}
            onChange={(e) => setMedicineForm({ ...medicineForm, form: e.target.value })}
            className="border rounded-lg px-3 py-2"
          >
            {FORMS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={medicineForm.time}
            onChange={(e) => setMedicineForm({ ...medicineForm, time: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Sıklık (örn. Günde 2 kez)"
            value={medicineForm.frequency}
            onChange={(e) => setMedicineForm({ ...medicineForm, frequency: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Günler (örn. Her Gün)"
            value={medicineForm.days}
            onChange={(e) => setMedicineForm({ ...medicineForm, days: e.target.value })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stok"
            value={medicineForm.stockQuantity}
            onChange={(e) => setMedicineForm({ ...medicineForm, stockQuantity: e.target.value })}
            className="border rounded-lg px-3 py-2"
            min="0"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Ekle
          </button>
        </form>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Kayıtlı İlaçlar</h2>
        {loading ? (
          <p className="text-gray-400">Yükleniyor...</p>
        ) : medicines.length === 0 ? (
          <p className="text-gray-400">Henüz ilaç eklenmemiş.</p>
        ) : (
          <ul className="divide-y">
            {medicines.map((med) => (
              <li
                key={med.id}
                className="flex justify-between items-center py-3 gap-4"
              >
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-gray-500">
                    {med.dosage} · {med.form}
                    {med.time ? ` · ${med.time}` : ""}
                    {med.frequency ? ` · ${med.frequency}` : ""}
                  </p>
                  <p className="text-xs text-gray-400">Stok: {med.stockQuantity}</p>
                </div>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="text-sm text-red-600 hover:underline shrink-0"
                >
                  Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
