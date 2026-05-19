import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboard as dashboardApi } from "../../services/api";
import IntakeChecklist from "../../components/IntakeChecklist";
import { getStoredUser } from "../../utils/auth";
import { greetingName } from "../../utils/medications";

const QUICK_ACTIONS = [
  { icon: "water_drop", label: "Su Kaydı" },
  { icon: "monitor_weight", label: "Kilo Kaydı" },
  { icon: "edit_calendar", label: "Reçete Yenile" },
  { icon: "medical_services", label: "Doktora Ulaş" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      setData(await dashboardApi.get(user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const schedule = data?.todaySchedule ?? [];
  const weekBars = data?.weekBars ?? [];
  const adherence = data?.adherence ?? 0;
  const lowStock = data?.lowStock ?? [];

  return (
    <div className="p-gutter lg:p-xl min-h-screen">
      <div className="max-w-container-max mx-auto space-y-lg">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
              {loading ? "Yükleniyor..." : greetingName(data?.user?.name || user?.name)}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Bugünkü sağlık özetiniz.</p>
          </div>
          <button
            onClick={() => navigate("/add-medication")}
            className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-xl font-body-lg text-body-lg font-semibold items-center gap-sm hover:scale-[1.02] transition-transform duration-300 shadow-premium hover:shadow-premium-hover"
          >
            <span className="material-symbols-outlined">add</span>İlaç Ekle
          </button>
        </div>

        {error && (
          <p className="text-error font-body-sm bg-error-container/20 p-md rounded-xl" role="alert">{error}</p>
        )}

        {alertVisible && lowStock.length > 0 && (
          <div className="bg-error-container text-on-error-container rounded-2xl p-md flex items-start gap-md shadow-premium border border-error/20">
            <span className="material-symbols-outlined filled text-error mt-xs">warning</span>
            <div className="flex-1">
              <h3 className="font-headline-md text-headline-md text-error mb-xs">Düşük Stok Uyarısı</h3>
              <p className="font-body-sm text-body-sm">
                <strong>{lowStock.map((m) => m.name).join(", ")}</strong> için stok azalıyor.
              </p>
            </div>
            <button onClick={() => setAlertVisible(false)} className="text-error hover:bg-error/10 p-xs rounded-full transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-lg">

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">

              {/* Progress Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20 flex flex-col items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="font-headline-md text-headline-md text-on-surface self-start mb-md">İlerlemem</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-variant stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" />
                    <path className="text-primary-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray={`${adherence}, 100`} strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-display-lg text-display-lg text-on-surface">{adherence}%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Uyum</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-md text-center">Bu hafta iyi gidiyorsunuz!</p>
              </div>

              {/* Bar Chart */}
              <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Son 7 Gün</h3>
                <div className="h-32 flex items-end justify-between gap-xs">
                  {weekBars.map(({ day, pct, today, empty }, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-xs">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          empty ? "bg-surface-variant" : today ? "bg-primary-container" : "bg-primary-container/20 hover:bg-primary-container/40"
                        }`}
                        style={{ height: `${pct}%` }}
                      />
                      <span className={`font-label-caps text-label-caps ${today ? "text-primary font-bold" : "text-on-surface-variant"}`}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
              <div className="flex justify-between items-center mb-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Bugünkü İlaçlarım</h2>
                <button onClick={() => navigate("/schedule")} className="text-primary-container font-label-caps text-label-caps hover:underline">Tümünü Gör</button>
              </div>
              {loading ? (
                <p className="text-on-surface-variant font-body-sm">Yükleniyor...</p>
              ) : (
                <IntakeChecklist
                  entries={schedule.map((item) => ({
                    ...item,
                    med: item.name,
                    dose: item.dose,
                    reminderId: item.reminderId ?? item.id,
                  }))}
                  onRefresh={load}
                  logDate={new Date().toISOString().slice(0, 10)}
                  emptyMessage="Bugün için planlanmış ilaç yok."
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-lg">

            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Hızlı İşlemler</h3>
              <div className="grid grid-cols-2 gap-sm">
                {QUICK_ACTIONS.map(({ icon, label }) => (
                  <button key={label} className="flex flex-col items-center justify-center p-md border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors group">
                    <span className="material-symbols-outlined text-primary-container mb-xs group-hover:scale-110 transition-transform">{icon}</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Vitals */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Son Vital Bulgular</h3>
              <div className="space-y-md">
                <div className="flex justify-between items-end border-b border-outline-variant/20 pb-sm">
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">BLOOD PRESSURE</p>
                    <p className="font-headline-md text-headline-md text-on-surface">120/80 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">mmHg</span></p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px]">trending_flat</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">HEART RATE</p>
                    <p className="font-headline-md text-headline-md text-on-surface">72 <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">bpm</span></p>
                  </div>
                  <span className="material-symbols-outlined text-error text-[20px]">trending_up</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
