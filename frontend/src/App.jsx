import { useEffect, useState } from "react";
import { getMedicines } from "./services/api";

function App() {
  const [medicines, setMedicines] = useState([]);

  // Sayfa yüklendiğinde backend'den verileri çek (Test amaçlı)
  useEffect(() => {
    getMedicines().then((data) => {
      setMedicines(data);
    });
  }, []);

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600">İlaç Takip Sistemi</h1>
        <p className="text-gray-500">
          Frontend ve Backend bağlantısı başarılı!
        </p>
      </header>

      <main>
        {/* İleride buraya <MedicineList /> veya <AddMedicineForm /> bileşenleri gelecek */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Kayıtlı İlaçlar</h2>
          {medicines.length === 0 ? (
            <p className="text-gray-400">Henüz ilaç eklenmemiş.</p>
          ) : (
            <ul>
              {medicines.map((med) => (
                <li key={med.id} className="border-b py-2">
                  {med.name} - {med.dosage} ({med.time})
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
