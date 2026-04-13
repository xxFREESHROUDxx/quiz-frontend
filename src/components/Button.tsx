import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "danger" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  isLoading,
  variant = "primary",
  fullWidth = false,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex items-center cursor-pointer justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
