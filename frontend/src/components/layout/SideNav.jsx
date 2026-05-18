import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: "dashboard",  label: "Dashboard"      },
  { to: "/medications",icon: "pill",       label: "Medications"    },
  { to: "/schedule",   icon: "event_note", label: "Schedule"       },
  { to: "/reports",    icon: "bar_chart",  label: "Health Reports" },
  { to: "/settings",   icon: "settings",   label: "Settings"       },
];

export default function SideNav() {
  return (
    <nav className="hidden md:flex bg-surface-container-low h-screen w-72 flex-col fixed left-0 top-0 border-r border-outline-variant/30 shadow-xl z-40">
      {/* Brand */}
      <div className="px-md py-lg">
        <NavLink to="/dashboard" className="block">
          <span className="font-display-lg text-headline-md tracking-tight text-primary">
            MedTrack Pro
          </span>
          <div className="text-on-surface-variant font-label-caps text-label-caps mt-xs">
            Premium Health Management
          </div>
        </NavLink>
      </div>

      {/* Nav links */}
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

      {/* User footer */}
      <div className="p-md border-t border-outline-variant/30 mt-auto">
        <div className="flex items-center gap-md mb-md px-md">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2np6ix4YIdxvHeo9PualtPVariZJDXMnmOXjneYeufL6So3ybrSBrV8whmLYKu3ab_Q2bHP7E02rJcUcGMlmOh3DDRsRh9FY83wlB-Vj-g37i6h-1Jk_5e1eEr1hrT7A0mrU7D0tPOIJ1kLRHda3wLKD6l5VClAz_ReQoBrF2KiUnCO0a45HOBsKws2XvLAPmeGhbuP3QYeMyratnci6RKvzWuBqP0gVBQ0c5JMFspNsi-Fr-GahlwqzOnSuZQdanTWifTCwJags"
            alt="User Profile"
            className="w-10 h-10 rounded-full border border-outline-variant/30 object-cover"
          />
          <div>
            <p className="font-body-sm text-body-sm font-semibold text-on-surface">
              Sarah Jenkins
            </p>
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              Premium
            </p>
          </div>
        </div>
        <button className="w-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps py-sm rounded-lg border border-outline-variant/50 hover:bg-surface-variant transition-colors">
          Upgrade to Pro
        </button>
      </div>
    </nav>
  );
}
