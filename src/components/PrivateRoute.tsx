import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { WEB_ROUTES } from "../constants/webRoutes";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { token, isHydrated } = useAuth();

  if (!isHydrated) {
    // TODO: Show loading spinner instead of blank page
    return null;
  }

  if (!token) {
    return <Navigate to={WEB_ROUTES.LOGIN} />;
  }

  return <>{children}</>;
}
