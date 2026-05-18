import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Static data ──────────────────────────────────────────────────────── */
const TODAY = new Date();
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getWeekDays(referenceDate) {
  const start = new Date(referenceDate);
  start.setDate(referenceDate.getDate() - referenceDate.getDay()); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Sample schedule data keyed by "YYYY-MM-DD"
function pad(n) { return String(n).padStart(2, "0"); }
function dateKey(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

const BASE_ENTRIES = [
  { id: 1, med: "Atorvastatin", dose: "20mg", time: "08:00", icon: "medication",   status: "taken",    note: "With food"  },
  { id: 2, med: "Metformin",    dose: "500mg",time: "13:00", icon: "vaccines",     status: "upcoming", note: "After meal" },
  { id: 3, med: "Lisinopril",   dose: "10mg", time: "21:00", icon: "water_drop",   status: "later",    note: null         },
  { id: 4, med: "Ibuprofen",    dose: "400mg",time: "09:00", icon: "prescriptions",status: "skipped",  note: "As needed"  },
];

function buildSchedule(weekDays) {
  const schedule = {};
  weekDays.forEach((day, i) => {
    const key = dateKey(day);
    // Vary entries per day for realism
    schedule[key] = BASE_ENTRIES.filter((_, ei) => (ei + i) % 3 !== 0).map((e) => ({
      ...e,
      status: day < TODAY ? (e.id === 4 ? "skipped" : "taken") :
              dateKey(day) === dateKey(TODAY) ? e.status : "later",
    }));
  });
  return schedule;
}

/* ── Status helpers ───────────────────────────────────────────────────── */
const STATUS_MAP = {
  taken:    { label: "Taken",    icon: "check_circle", color: "text-green-600",         bg: "bg-green-50"          },
  upcoming: { label: "Take Now", icon: "schedule",     color: "text-primary-container",  bg: "bg-primary-container/10" },
  later:    { label: "Scheduled",icon: "schedule",     color: "text-on-surface-variant", bg: "bg-surface-variant/50"   },
  skipped:  { label: "Skipped",  icon: "cancel",       color: "text-error",              bg: "bg-error-container/30"   },
};

function fmt12(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${pad(m)} ${suffix}`;
}

/* ── Component ────────────────────────────────────────────────────────── */
export default function Schedule() {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(dateKey(TODAY));

  const referenceDate = new Date(TODAY);
  referenceDate.setDate(TODAY.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(referenceDate);
  const schedule = buildSchedule(weekDays);

  const entries = schedule[selectedDay] ?? [];
  const totalToday = entries.length;
  const takenToday = entries.filter((e) => e.status === "taken").length;

  const monthLabel = (() => {
    const months = [...new Set(weekDays.map((d) => MONTH_NAMES[d.getMonth()]))];
    return months.join(" / ") + " " + weekDays[0].getFullYear();
  })();

  function markTaken(id) {
    // In a real app dispatch to state/API here
    alert(`Marked as taken! (connect to state/API)`);
  }

  return (
    <div className="p-gutter md:p-xl max-w-container-max mx-auto min-h-screen">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div>
          <h1 className="font-display-lg text-headline-md text-on-surface mb-xs">Schedule</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Track your daily medication plan.
          </p>
        </div>
        <button
          onClick={() => navigate("/add-medication")}
          className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-xl font-label-caps text-label-caps items-center gap-xs hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300"
        >
          <span className="material-symbols-outlined text-sm">add</span>Add Medication
        </button>
      </div>

      {/* ── Weekly Adherence Summary ────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 p-lg mb-lg">
        <div className="flex items-center justify-between mb-md">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">THIS WEEK</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {takenToday}/{totalToday} taken today
            </p>
          </div>
          {/* Week navigation */}
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-body-sm text-body-sm text-on-surface font-semibold min-w-[140px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => { setWeekOffset(0); setSelectedDay(dateKey(TODAY)); }}
                className="ml-xs px-sm py-xs rounded-full bg-primary/10 text-primary font-label-caps text-label-caps hover:bg-primary/20 transition-colors"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Day selector strip */}
        <div className="grid grid-cols-7 gap-xs">
          {weekDays.map((day) => {
            const key = dateKey(day);
            const isToday = key === dateKey(TODAY);
            const isSelected = key === selectedDay;
            const dayEntries = schedule[key] ?? [];
            const allTaken = dayEntries.length > 0 && dayEntries.every((e) => e.status === "taken");
            const hasSkipped = dayEntries.some((e) => e.status === "skipped");

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`flex flex-col items-center py-sm px-xs rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-primary-container text-on-primary shadow-sm scale-[1.05]"
                    : isToday
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-surface-container text-on-surface-variant"
                }`}
              >
                <span className="font-label-caps text-label-caps mb-xs">{DAY_NAMES[day.getDay()]}</span>
                <span className={`font-headline-md text-headline-md ${isSelected ? "text-on-primary" : ""}`}>
                  {day.getDate()}
                </span>
                {/* Dot indicator */}
                <div className="mt-xs h-1.5 w-1.5 rounded-full">
                  {allTaken && <div className="w-full h-full rounded-full bg-green-500" />}
                  {hasSkipped && !allTaken && <div className="w-full h-full rounded-full bg-error" />}
                  {!allTaken && !hasSkipped && dayEntries.length > 0 && (
                    <div className={`w-full h-full rounded-full ${isSelected ? "bg-on-primary/50" : "bg-outline-variant"}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Day Detail ─────────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 p-lg">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {(() => {
              const d = new Date(selectedDay + "T12:00:00");
              const isToday = dateKey(d) === dateKey(TODAY);
              return isToday
                ? "Today's Medications"
                : `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
            })()}
          </h2>
          <div className="flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {entries.filter((e) => e.status === "taken").length} / {entries.length} done
            </span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center">
            <span className="material-symbols-outlined text-outline text-[48px] mb-md">event_available</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">No medications scheduled for this day.</p>
            <button
              onClick={() => navigate("/add-medication")}
              className="mt-md text-primary font-body-sm text-body-sm hover:underline flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>Add medication
            </button>
          </div>
        ) : (
          <div className="space-y-sm">
            {entries
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((entry) => {
                const st = STATUS_MAP[entry.status];
                const isUpcoming = entry.status === "upcoming";

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-md rounded-xl border transition-all duration-200 hover:shadow-premium-hover relative overflow-hidden
                      ${isUpcoming ? "border-primary/20 shadow-sm" : "border-outline-variant/20 hover:border-primary/20"}`}
                  >
                    {isUpcoming && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container" />}
                    <div className={`flex items-center gap-md ${isUpcoming ? "pl-xs" : ""}`}>
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${st.bg}`}>
                        <span className={`material-symbols-outlined ${st.color}`}>{st.icon}</span>
                      </div>
                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-sm flex-wrap">
                          <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{entry.med}</h4>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{entry.dose}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {fmt12(entry.time)}{entry.note ? ` · ${entry.note}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Right side action */}
                    <div className="flex items-center gap-sm flex-shrink-0 ml-md">
                      {entry.status === "taken" && (
                        <span className="bg-green-50 text-green-700 px-sm py-xs rounded-lg font-label-caps text-label-caps flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">check</span>Taken
                        </span>
                      )}
                      {entry.status === "skipped" && (
                        <span className="bg-error-container/30 text-error px-sm py-xs rounded-lg font-label-caps text-label-caps">
                          Skipped
                        </span>
                      )}
                      {entry.status === "later" && (
                        <span className="text-on-surface-variant font-body-sm text-body-sm">{fmt12(entry.time)}</span>
                      )}
                      {entry.status === "upcoming" && (
                        <button
                          onClick={() => markTaken(entry.id)}
                          className="bg-primary-container text-on-primary px-md py-xs rounded-lg font-label-caps text-label-caps hover:bg-primary transition-colors"
                        >
                          Take Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-md mt-lg">
        {Object.entries(STATUS_MAP).map(([key, { label, icon, color }]) => (
          <div key={key} className="flex items-center gap-xs">
            <span className={`material-symbols-outlined text-[16px] ${color}`}>{icon}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
