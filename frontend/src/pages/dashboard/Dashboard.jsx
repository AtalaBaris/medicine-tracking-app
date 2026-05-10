import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SCHEDULE = [
  { id: 1, name: "Atorvastatin", dose: "20mg", note: "With food", time: "08:00 AM", status: "taken", icon: "check_circle" },
  { id: 2, name: "Metformin", dose: "500mg", note: "After meal", time: "01:00 PM", status: "upcoming", icon: "schedule" },
  { id: 3, name: "Lisinopril", dose: "10mg", note: null, time: "09:00 PM", status: "later", icon: "nightlight" },
];

const WEEK_BARS = [
  { day: "M", pct: 40 }, { day: "T", pct: 60 }, { day: "W", pct: 80 },
  { day: "T", pct: 100, today: true }, { day: "F", pct: 90 },
  { day: "S", pct: 50 }, { day: "S", pct: 20, empty: true },
];

const QUICK_ACTIONS = [
  { icon: "water_drop", label: "Log Water" },
  { icon: "monitor_weight", label: "Log Weight" },
  { icon: "edit_calendar", label: "Refill Request" },
  { icon: "medical_services", label: "Contact Dr." },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="p-gutter lg:p-xl min-h-screen">
      <div className="max-w-container-max mx-auto space-y-lg">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Good Morning, Sarah</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Here is your health overview for today.</p>
          </div>
          <button
            onClick={() => navigate("/add-medication")}
            className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-xl font-body-lg text-body-lg font-semibold items-center gap-sm hover:scale-[1.02] transition-transform duration-300 shadow-premium hover:shadow-premium-hover"
          >
            <span className="material-symbols-outlined">add</span>Add Medication
          </button>
        </div>

        {/* Alert */}
        {alertVisible && (
          <div className="bg-error-container text-on-error-container rounded-2xl p-md flex items-start gap-md shadow-premium border border-error/20">
            <span className="material-symbols-outlined filled text-error mt-xs">warning</span>
            <div className="flex-1">
              <h3 className="font-headline-md text-headline-md text-error mb-xs">Low Stock Alert</h3>
              <p className="font-body-sm text-body-sm">
                You have fewer than 3 doses left of <strong>Lisinopril</strong>. Consider requesting a refill soon.
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
                <h3 className="font-headline-md text-headline-md text-on-surface self-start mb-md">My Progress</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-surface-variant stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" />
                    <path className="text-primary-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="85, 100" strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-display-lg text-display-lg text-on-surface">85%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Adherence</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-md text-center">Great job! You&apos;re on track this week.</p>
              </div>

              {/* Bar Chart */}
              <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Last 7 Days</h3>
                <div className="h-32 flex items-end justify-between gap-xs">
                  {WEEK_BARS.map(({ day, pct, today, empty }, i) => (
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
                <h2 className="font-headline-md text-headline-md text-on-surface">Today&apos;s Schedule</h2>
                <button className="text-primary-container font-label-caps text-label-caps hover:underline">View All</button>
              </div>
              <div className="space-y-sm">
                {SCHEDULE.map((item) => (
                  <div
                    key={item.id}
                    className={`group flex items-center justify-between p-md rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-surface-container-lowest relative overflow-hidden
                      ${item.status === "upcoming" ? "border border-primary/20 shadow-sm hover:shadow-premium-hover" : "border border-outline-variant/30 hover:shadow-premium-hover hover:border-primary/30"}`}
                  >
                    {item.status === "upcoming" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />}
                    <div className={`flex items-center gap-md ${item.status === "upcoming" ? "pl-xs" : ""}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                        ${item.status === "upcoming" ? "bg-primary-container/10 text-primary-container" : "bg-surface-variant text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{item.name}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{item.dose}{item.note ? ` • ${item.note}` : ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.status === "taken" ? (
                        <>
                          <p className="font-label-caps text-label-caps text-on-surface-variant line-through">{item.time}</p>
                          <span className="inline-block mt-xs bg-surface-container px-2 py-1 rounded-sm font-label-caps text-label-caps text-on-surface-variant">Taken</span>
                        </>
                      ) : item.status === "upcoming" ? (
                        <>
                          <p className="font-body-lg text-body-lg font-bold text-primary-container">{item.time}</p>
                          <button className="mt-xs bg-primary-container text-on-primary px-3 py-1 rounded-md font-label-caps text-label-caps hover:bg-primary transition-colors">Take Now</button>
                        </>
                      ) : (
                        <p className="font-body-sm text-body-sm font-semibold text-on-surface">{item.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-lg">

            {/* Quick Actions */}
            <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Quick Actions</h3>
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
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Recent Vitals</h3>
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
