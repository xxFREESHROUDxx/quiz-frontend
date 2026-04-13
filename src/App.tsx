import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TakeQuizPage from "./pages/TakeQuizPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import { WEB_ROUTES } from "./constants/webRoutes";

function RootRedirect() {
  const { token } = useAuth();

  return token ? <Navigate to={WEB_ROUTES.DASHBOARD} /> : <Navigate to={WEB_ROUTES.LOGIN} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path={WEB_ROUTES.HOME} element={<RootRedirect />} />

          {/* Public routes */}
          <Route path={WEB_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={WEB_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={WEB_ROUTES.PERMALINK} element={<TakeQuizPage />} />

          {/* Protected routes */}
          <Route
            path={WEB_ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path={WEB_ROUTES.CREATE_QUIZ}
            element={
              <PrivateRoute>
                <CreateQuizPage />
              </PrivateRoute>
            }
          />

          <Route
            path={WEB_ROUTES.EDIT_QUIZ}
            element={
              <PrivateRoute>
                <EditQuizPage />
              </PrivateRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={WEB_ROUTES.HOME} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
