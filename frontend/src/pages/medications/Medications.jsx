import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MedCard from "../../components/ui/MedCard";

const MEDS = [
  { id: 1, name: "Lisinopril",   dose: "10mg",  frequency: "Daily",   icon: "medication",    inventoryLabel: "45 days left", inventoryPct: 60,  variant: "default"   },
  { id: 2, name: "Atorvastatin", dose: "20mg",  frequency: "Nightly", icon: "vaccines",      inventoryLabel: "4 pills left", inventoryPct: null, variant: "low-stock" },
  { id: 3, name: "Ibuprofen",    dose: "400mg", frequency: "PRN",     icon: "prescriptions", inventoryLabel: "24 pills left",inventoryPct: 80,  variant: "as-needed" },
  { id: 4, name: "Latanoprost",  dose: "1 Drop",frequency: "Evening", icon: "water_drop",    inventoryLabel: "Good",         inventoryPct: 90,  variant: "default"   },
];

const FILTERS = ["All Active (8)", "Low Stock (2)", "As Needed (3)", "Archived"];

export default function Medications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = MEDS.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-gutter md:p-xl max-w-container-max mx-auto w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-xl gap-md">
        <div>
          <h2 className="font-display-lg text-headline-md text-on-surface">My Medications</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Manage your prescriptions and inventory</p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medications..."
              className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg pl-xl pr-sm py-sm font-body-sm text-body-sm focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => navigate("/add-medication")}
            className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-2xl font-label-caps text-label-caps hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300 items-center gap-xs whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">add</span>Add Medication
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto gap-sm mb-lg pb-unit scrollbar-hide">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            onClick={() => setActiveFilter(i)}
            className={`px-md py-xs rounded-full font-label-caps text-label-caps border whitespace-nowrap transition-colors ${
              activeFilter === i
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {filtered.map((med) => (
          <MedCard
            key={med.id}
            name={med.name}
            dose={med.dose}
            frequency={med.frequency}
            icon={med.icon}
            inventoryLabel={med.inventoryLabel}
            inventoryPct={med.inventoryPct}
            variant={med.variant}
            onRefill={() => alert(`Refill request sent for ${med.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
