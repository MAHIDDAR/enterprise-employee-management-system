import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPassword";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import EmployeesPage from "../pages/Employees/EmployeesPage";
import DepartmentsPage from "../pages/Departments/DepartmentsPage";
import CompanyPage from "../pages/Company/CompanyPage";
import AttendancePage from "../pages/Attendance/AttendancePage";
import SettingsPage from "../pages/Settings/SettingsPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import AuditLogsPage from "../pages/AuditLogs/AuditLogsPage";
import InvitationsPage from "../pages/Invitations/InvitationsPage";
import AccountDeactivatedPage from "../pages/AccountDeactivated/AccountDeactivatedPage";

import ProtectedRoute from "./ProtectedRoute";

import DashboardLayout from "../components/layout/DashboardLayout";


function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        {/* PROTECTED */}
        <Route
          element={<ProtectedRoute />}
        >

          {/* DEACTIVATED ACCOUNT PAGE */}
          <Route
            path="/account-deactivated"
            element={<AccountDeactivatedPage />}
          />

          <Route
            element={<DashboardLayout />}
          >

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/employees"
              element={<EmployeesPage />}
            />

            <Route
              path="/company"
              element={<CompanyPage />}
            />

            <Route
              path="/departments"
              element={<DepartmentsPage />}
            />

            <Route
              path="/attendance"
              element={<AttendancePage />}
            />

            <Route
              path="/audit-logs"
              element={<AuditLogsPage />}
            />

            <Route
              path="/invitations"
              element={<InvitationsPage />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;