import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { WEB_ROUTES } from "../constants/webRoutes";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(WEB_ROUTES.LOGIN, { replace: true });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition"
        >
          Quiz Builder
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}
