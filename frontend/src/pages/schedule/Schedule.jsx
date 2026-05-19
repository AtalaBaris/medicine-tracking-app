import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { schedule as scheduleApi } from "../../services/api";
import { getStoredUser } from "../../utils/auth";
import IntakeChecklist from "../../components/IntakeChecklist";

const TODAY = new Date();
const DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function pad(n) {
  return String(n).padStart(2, "0");
}
function dateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getWeekDays(referenceDate) {
  const start = new Date(referenceDate);
  start.setDate(referenceDate.getDate() - referenceDate.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function Schedule() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(dateKey(TODAY));
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  const referenceDate = new Date(TODAY);
  referenceDate.setDate(TODAY.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(referenceDate);
  const from = dateKey(weekDays[0]);
  const to = dateKey(weekDays[6]);
  const todayKey = dateKey(TODAY);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await scheduleApi.get(user.id, from, to);
      setSchedule(res.schedule || {});
    } catch (err) {
      console.error(err);
      setSchedule({});
    } finally {
      setLoading(false);
    }
  }, [user?.id, from, to]);

  useEffect(() => {
    load();
  }, [load]);

  const entries = schedule[selectedDay] ?? [];
  const todayEntries = schedule[todayKey] ?? [];
  const totalToday = todayEntries.length;
  const takenToday = todayEntries.filter((e) => e.status === "taken").length;
  const canMark = selectedDay <= todayKey;

  const monthLabel = (() => {
    const months = [...new Set(weekDays.map((d) => MONTH_NAMES[d.getMonth()]))];
    return months.join(" / ") + " " + weekDays[0].getFullYear();
  })();

  const dayTitle = (() => {
    const d = new Date(selectedDay + "T12:00:00");
    if (dateKey(d) === todayKey) return "Bugünkü İlaçlarım";
    return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
  })();

  return (
    <div className="p-gutter md:p-xl max-w-container-max mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div>
          <h1 className="font-display-lg text-headline-md text-on-surface mb-xs">Program</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Saatlerinizi görün, içtiklerinizi işaretleyin.
          </p>
        </div>
        <button
          onClick={() => navigate("/add-medication")}
          className="hidden md:flex bg-primary-container text-on-primary px-md py-sm rounded-xl font-label-caps text-label-caps items-center gap-xs hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          İlaç Ekle
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 p-lg mb-lg">
        <div className="flex items-center justify-between mb-md">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-xs">BU HAFTA</p>
            <p className="font-headline-md text-headline-md text-on-surface">
              Bugün {takenToday}/{totalToday} alındı
            </p>
          </div>
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
                onClick={() => {
                  setWeekOffset(0);
                  setSelectedDay(todayKey);
                }}
                className="ml-xs px-sm py-xs rounded-full bg-primary/10 text-primary font-label-caps text-label-caps hover:bg-primary/20 transition-colors"
              >
                Bugün
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-xs">
          {weekDays.map((day) => {
            const key = dateKey(day);
            const isToday = key === todayKey;
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
                <div className="mt-xs h-1.5 w-1.5 rounded-full">
                  {allTaken && dayEntries.length > 0 && (
                    <div className="w-full h-full rounded-full bg-green-500" />
                  )}
                  {hasSkipped && !allTaken && <div className="w-full h-full rounded-full bg-error" />}
                  {!allTaken && !hasSkipped && dayEntries.length > 0 && (
                    <div
                      className={`w-full h-full rounded-full ${isSelected ? "bg-on-primary/50" : "bg-outline-variant"}`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 p-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{dayTitle}</h2>

        {loading ? (
          <p className="text-on-surface-variant font-body-sm py-md">Yükleniyor...</p>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center">
            <span className="material-symbols-outlined text-outline text-[48px] mb-md">event_available</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Bu gün için planlanmış ilaç yok.</p>
            <button
              onClick={() => navigate("/add-medication")}
              className="mt-md text-primary font-body-sm hover:underline flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              İlaç ekle
            </button>
          </div>
        ) : (
          <IntakeChecklist
            entries={entries}
            onRefresh={load}
            allowToggle={canMark}
            logDate={selectedDay}
            showBulkButton={canMark && selectedDay === todayKey}
            emptyMessage="Bu gün için planlanmış ilaç yok."
          />
        )}

        {!canMark && entries.length > 0 && (
          <p className="font-body-sm text-on-surface-variant mt-md text-center">
            Gelecek günler için işaretleme yapılamaz.
          </p>
        )}
      </div>
    </div>
  );
}
