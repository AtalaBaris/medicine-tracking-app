import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/loginPage/loginpage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Medications from "./pages/medications/Medications";
import AddMedication from "./pages/addMedication/AddMedication";
import Reports from "./pages/reports/Reports";
import Schedule from "./pages/schedule/Schedule";
import Settings from "./pages/settings/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App routes - wrapped in shared layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/add-medication" element={<AddMedication />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
