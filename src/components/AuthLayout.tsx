import type { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  subtitleLinkText: string;
  subtitleLinkHref: string;
  children: ReactNode;
}

const AuthLayout: FunctionComponent<AuthLayoutProps> = ({
  title,
  subtitle,
  subtitleLinkText,
  subtitleLinkHref,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quiz Builder</h1>
          <p className="text-gray-500 mt-2">{title}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>

        {/* Bottom Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {subtitle}&nbsp;
          <Link to={subtitleLinkHref} className="text-blue-600 hover:underline font-medium">
            {subtitleLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
