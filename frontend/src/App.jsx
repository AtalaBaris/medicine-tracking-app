import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/loginPage/loginpage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Medications from "./pages/medications/Medications";
import AddMedication from "./pages/addMedication/AddMedication";
import Reports from "./pages/reports/Reports";
import Schedule from "./pages/schedule/Schedule";
import Settings from "./pages/settings/Settings";
import { getStoredUser } from "./utils/auth";

function ProtectedRoute() {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function PublicOnlyRoute() {
  const user = getStoredUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/add-medication" element={<AddMedication />} />
          <Route path="/medications/:id/edit" element={<AddMedication />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
