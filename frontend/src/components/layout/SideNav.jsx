import { NavLink } from "react-router-dom";
import { getStoredUser } from "../../utils/auth";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "dashboard", label: "Panel" },
  { to: "/medications", icon: "pill", label: "İlaçlar" },
  { to: "/schedule", icon: "event_note", label: "Program" },
  { to: "/reports", icon: "bar_chart", label: "Sağlık Raporları" },
  { to: "/settings", icon: "settings", label: "Ayarlar" },
];

export default function SideNav() {
  const user = getStoredUser();

  return (
    <nav className="hidden md:flex bg-surface-container-low h-screen w-72 flex-col fixed left-0 top-0 border-r border-outline-variant/30 shadow-xl z-40">
      <div className="px-md py-lg">
        <NavLink to="/dashboard" className="block">
          <span className="font-display-lg text-headline-md tracking-tight text-primary">
            MedTrack Pro
          </span>
          <div className="text-on-surface-variant font-label-caps text-label-caps mt-xs">
            Premium Sağlık Yönetimi
          </div>
        </NavLink>
      </div>

      <div className="flex flex-col flex-grow gap-unit px-unit py-md">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? "bg-primary-container text-on-primary-container rounded-xl mx-sm my-xs px-md py-sm flex items-center gap-md shadow-sm transition-all duration-300"
                : "text-on-surface-variant mx-sm my-xs px-md py-sm flex items-center gap-md rounded-xl hover:bg-surface-container-high transition-all duration-300"
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`material-symbols-outlined${isActive ? " filled" : ""}`}
                >
                  {icon}
                </span>
                <span className={`font-body-sm text-body-sm${isActive ? " font-bold" : ""}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-md border-t border-outline-variant/30 mt-auto">
        <div className="flex items-center gap-md px-md">
          <div
            className="w-10 h-10 rounded-full border border-outline-variant/30 bg-primary-container/10 flex items-center justify-center flex-shrink-0"
            aria-hidden
          >
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
          <div className="min-w-0">
            <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
              {user?.name || "Kullanıcı"}
            </p>
            <p className="font-label-caps text-label-caps text-on-surface-variant truncate">
              {user?.email || "Üye"}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
