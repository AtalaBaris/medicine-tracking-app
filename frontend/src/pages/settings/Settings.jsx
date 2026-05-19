import { useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "../../utils/auth";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "person",          label: "Profile",           sub: "Manage your personal information" },
      { icon: "notifications",   label: "Notifications",     sub: "Reminders and alert preferences"  },
      { icon: "lock",            label: "Privacy & Security",sub: "Password, 2FA and data settings"  },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "palette",         label: "Appearance",        sub: "Theme, font size and display"     },
      { icon: "language",        label: "Language & Region", sub: "Locale and time zone settings"    },
      { icon: "devices",         label: "Connected Devices", sub: "Wearables and integrations"       },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help",            label: "Help Center",       sub: "FAQs and getting started guides"  },
      { icon: "bug_report",      label: "Report a Bug",      sub: "Send feedback to our team"        },
      { icon: "info",            label: "About",             sub: "Version 1.0.0 • MedTrack Pro"     },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    clearStoredUser();
    navigate("/login");
  }

  return (
    <div className="p-gutter md:p-xl max-w-2xl mx-auto">

      <div className="mb-xl">
        <h1 className="font-display-lg text-headline-md text-on-surface mb-xs">Settings</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Manage your account and app preferences.</p>
      </div>

      {/* Profile card */}
      <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-premium border border-outline-variant/20 mb-lg flex items-center gap-md">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2np6ix4YIdxvHeo9PualtPVariZJDXMnmOXjneYeufL6So3ybrSBrV8whmLYKu3ab_Q2bHP7E02rJcUcGMlmOh3DDRsRh9FY83wlB-Vj-g37i6h-1Jk_5e1eEr1hrT7A0mrU7D0tPOIJ1kLRHda3wLKD6l5VClAz_ReQoBrF2KiUnCO0a45HOBsKws2XvLAPmeGhbuP3QYeMyratnci6RKvzWuBqP0gVBQ0c5JMFspNsi-Fr-GahlwqzOnSuZQdanTWifTCwJags"
          alt="Profile"
          className="w-14 h-14 rounded-full border-2 border-primary-container/30 object-cover"
        />
        <div className="flex-1">
          <p className="font-headline-md text-headline-md text-on-surface">{user?.name || "Kullanıcı"}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email || ""}</p>
        </div>
        <button className="text-primary font-body-sm text-body-sm hover:underline">Edit</button>
      </div>

      {/* Setting sections */}
      <div className="space-y-lg">
        {SECTIONS.map(({ title, items }) => (
          <div key={title}>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-sm px-xs">{title}</p>
            <div className="bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 overflow-hidden">
              {items.map(({ icon, label, sub }, i) => (
                <button
                  key={label}
                  className={`w-full flex items-center gap-md px-lg py-md hover:bg-surface-container-low transition-colors text-left ${
                    i < items.length - 1 ? "border-b border-outline-variant/20" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-body-lg text-body-lg font-semibold text-on-surface">{label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{sub}</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade banner */}
      <div className="mt-lg bg-primary-container rounded-2xl p-lg flex items-center gap-md">
        <span className="material-symbols-outlined filled text-on-primary text-[32px]">star</span>
        <div className="flex-1">
          <p className="font-headline-md text-headline-md text-on-primary">Upgrade to Pro</p>
          <p className="font-body-sm text-body-sm text-on-primary/80">Unlock unlimited medications, advanced reports and priority support.</p>
        </div>
        <button className="bg-on-primary text-primary px-md py-sm rounded-xl font-label-caps text-label-caps hover:opacity-90 transition-opacity flex-shrink-0">
          Upgrade
        </button>
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-lg w-full py-sm px-md border border-error/30 rounded-xl text-error font-body-sm text-body-sm font-semibold hover:bg-error/5 transition-colors flex items-center justify-center gap-sm"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        Çıkış Yap
      </button>
    </div>
  );
}
