import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LeadsPage } from "./pages/LeadsPage";
import { LeadFormPage } from "./pages/LeadFormPage";
import { NotFoundPage } from "./pages/NotFoundPage"; 
import { LeadDetailPage } from "./pages/LeadDetailPage"; 
import { DashboardPage } from "./pages/DashboardPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/leads" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <LeadsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <LeadFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id/edit"
          element={
            <ProtectedRoute>
              <LeadFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <LeadDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
  }
/>

        

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
