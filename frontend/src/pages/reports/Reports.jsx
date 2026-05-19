import { useEffect, useState } from "react";
import { reports as reportsApi } from "../../services/api";
import { getStoredUser } from "../../utils/auth";

export default function Reports() {
  const user = getStoredUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    reportsApi.adherence(user.id, 30).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [user?.id]);

  const BARS = data?.weeklyBars ?? [];
  const MED_DETAILS = data?.medications ?? [];
  const overallPct = data?.overallPct ?? 0;
  const taken = data?.taken ?? 0;
  const missed = data?.missed ?? 0;

  return (
    <div className="p-gutter md:p-xl bg-background min-h-screen w-full">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Reports &amp; Analytics</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Your medication adherence and health trends.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-md py-sm flex items-center gap-sm shadow-sm cursor-pointer hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-outline text-sm">calendar_month</span>
            <span className="font-body-sm text-body-sm text-on-surface">Oct 1 – Oct 31, 2023</span>
            <span className="material-symbols-outlined text-outline text-sm ml-sm">expand_more</span>
          </div>
          <button className="bg-primary-container text-on-primary py-sm px-md rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-xs hover:scale-[1.02] hover:shadow-premium-hover transition-all duration-300">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download PDF
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">

        {/* Adherence Ring */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20 flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Overall Adherence</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Last 30 days performance</p>
          </div>
          <div className="flex-grow flex items-center justify-center py-xl relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="#f0f0fb" strokeWidth="8" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#0052cc" strokeDasharray="251.2" strokeDashoffset="30.14" strokeLinecap="round" strokeWidth="8" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display-lg text-display-lg text-on-surface">{loading ? "—" : `${overallPct}%`}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mt-xs">Excellent</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-md border-t border-outline-variant/20">
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Alınan: {taken}</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-outline-variant" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Kaçırılan: {missed}</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20 md:col-span-2 hover:shadow-premium-hover transition-all duration-300 flex flex-col">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Daily Logging Trends</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Weekly view of medications logged</p>
            </div>
            <div className="flex gap-sm">
              {["W", "M", "Y"].map((label, i) => (
                <span
                  key={label}
                  className={`px-sm py-xs rounded-md font-label-caps text-label-caps cursor-pointer ${
                    i === 1 ? "bg-primary-container/10 text-primary-container" : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-grow flex items-end justify-between gap-xs md:gap-sm mt-auto relative pt-xl">
            {/* Y-axis lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-6 opacity-30 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-outline-variant w-full h-0" />
              ))}
            </div>
            {BARS.map(({ day, pct, low }) => (
              <div key={day} className="w-full flex flex-col items-center z-10 group cursor-pointer">
                <div
                  className={`w-full max-w-[24px] rounded-t-sm relative transition-colors ${
                    low ? "bg-outline-variant group-hover:bg-outline" : "bg-primary-container group-hover:bg-primary"
                  }`}
                  style={{ height: `${pct}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-caps text-label-caps px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {pct}%
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant mt-sm">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details Table */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20 md:col-span-3 hover:shadow-premium-hover transition-all duration-300">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Medication Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-caps text-label-caps">
                  <th className="py-sm font-semibold">Medication</th>
                  <th className="py-sm font-semibold">Dosage</th>
                  <th className="py-sm font-semibold">Frequency</th>
                  <th className="py-sm font-semibold text-right">Adherence Rate</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {MED_DETAILS.map(({ name, icon, dose, freq, pct, color, error }) => (
                  <tr key={name} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low transition-colors">
                    <td className="py-md text-on-surface font-semibold">
                      <div className="flex items-center gap-sm">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${error ? "bg-error-container/20 text-error" : "bg-primary-container/10 text-primary-container"}`}>
                          <span className="material-symbols-outlined text-[16px]">{icon}</span>
                        </span>
                        {name}
                      </div>
                    </td>
                    <td className="py-md text-on-surface-variant">{dose}</td>
                    <td className="py-md text-on-surface-variant">{freq}</td>
                    <td className="py-md text-right">
                      <div className="flex items-center justify-end gap-sm">
                        <div className="w-24 bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-semibold text-on-surface">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
