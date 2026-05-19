import { NavLink } from "react-router-dom";

const MOBILE_ITEMS = [
  { to: "/dashboard", icon: "dashboard", label: "Panel" },
  { to: "/medications", icon: "pill", label: "İlaçlar" },
  { to: "/schedule", icon: "event_note", label: "Program" },
  { to: "/reports", icon: "bar_chart", label: "Raporlar" },
  { to: "/settings", icon: "settings", label: "Ayarlar" },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-surface-container-highest flex justify-around items-center h-16 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {MOBILE_ITEMS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${
              isActive ? "text-primary-container" : "text-on-surface-variant"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined mb-1${isActive ? " filled" : ""}`}>
                {icon}
              </span>
              <span className={`font-label-caps text-[10px]${isActive ? " font-bold" : ""}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
