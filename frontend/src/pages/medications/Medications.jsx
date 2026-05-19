import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MedCard from "../../components/ui/MedCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { medications } from "../../services/api";
import { getStoredUser } from "../../utils/auth";
import { groupMedications, mapMedicationToCard } from "../../utils/medications";

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "low", label: "Düşük Stok" },
  { key: "asneeded", label: "İhtiyaç Halinde" },
];

export default function Medications() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await medications.list(user.id);
      setMeds(groupMedications(data).map(mapMedicationToCard));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = meds.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "low") return m.variant === "low-stock";
    if (activeFilter === "asneeded") return m.variant === "as-needed";
    return true;
  });

  const handleRefill = async (id) => {
    try {
      await medications.refill(id, 30);
      await load();
    } catch (err) {
      alert(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await medications.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-gutter md:p-xl max-w-container-max mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-xl gap-md">
        <div>
          <h2 className="font-display-lg text-headline-md text-on-surface">İlaçlarım</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
            Reçetelerinizi ve stok durumunuzu yönetin
          </p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İlaç ara..."
              className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg pl-12 pr-sm py-sm font-body-sm text-body-sm focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => navigate("/add-medication")}
            className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-2xl font-label-caps text-label-caps hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300 items-center gap-xs whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            İlaç Ekle
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-md text-error font-body-sm" role="alert">
          {error}
        </p>
      )}

      <div className="flex overflow-x-auto gap-sm mb-lg pb-unit scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-md py-xs rounded-full font-label-caps text-label-caps border whitespace-nowrap transition-colors ${
              activeFilter === f.key
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            }`}
          >
            {f.label} (
            {f.key === "all"
              ? meds.length
              : meds.filter((m) =>
                  f.key === "low" ? m.variant === "low-stock" : m.variant === "as-needed"
                ).length}
            )
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-xl">
          <p className="text-on-surface-variant mb-md">Henüz ilaç yok.</p>
          <button
            onClick={() => navigate("/add-medication")}
            className="text-primary font-body-sm hover:underline"
          >
            İlk ilacınızı ekleyin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filtered.map((med) => (
            <div key={med.id} className="relative group">
              <MedCard
                {...med}
                onRefill={
                  med.variant === "low-stock" ? () => handleRefill(med.id) : undefined
                }
              />
              <div className="absolute top-md right-md flex gap-xs opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => navigate(`/medications/${med.id}/edit`)}
                  className="p-xs rounded-full bg-surface/95 text-primary hover:bg-primary/10 shadow-sm"
                  title="Düzenle"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(med)}
                  className="p-xs rounded-full bg-surface/95 text-error hover:bg-error/10 shadow-sm"
                  title="Sil"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="İlacı sil"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" ilacını ve tüm hatırlatıcılarını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
            : ""
        }
        confirmLabel="Evet, sil"
        cancelLabel="Vazgeç"
        variant="danger"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
      />
    </div>
  );
}
