import { Outlet, useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

// Pages that render their own focused header (no global shell)
const NO_NAV_ROUTES = ["/add-medication"];

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideNav = NO_NAV_ROUTES.includes(pathname);

  return (
    <div className="bg-background text-on-background antialiased flex min-h-screen font-body-lg">
      {!hideNav && <SideNav />}
      {!hideNav && <TopBar />}

      <main
        className={`flex-1 min-h-screen ${
          hideNav ? "" : "md:ml-72 pt-[72px] md:pt-0 pb-20 md:pb-0"
        }`}
      >
        <Outlet />
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
}
