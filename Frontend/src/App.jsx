import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./routes/AdminRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import ModulePage from "./pages/ModulePage";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Students = lazy(() => import("./pages/Students"));

const moduleRoutes = [
  ["teachers", "Teachers"],
  ["classes", "Classes"],
  ["subjects", "Subjects"],
  ["timetable", "Timetable"],
  ["fees", "Fees"],
  ["attendance", "Attendance"],
  ["exams", "Exams"],
  ["admissions", "Admissions"],
  ["expenses", "Expenses"],
  ["reports", "Reports"],
  ["notifications", "Notifications"],
  ["settings", "Settings"],
];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#fff" } }} />
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#0B1120] text-slate-300">Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              {moduleRoutes.map(([path, title]) => (
                <Route
                  key={path}
                  path={path}
                  element={<ModulePage title={title} />}
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
