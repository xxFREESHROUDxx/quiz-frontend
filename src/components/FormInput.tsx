import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, Props>(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
              error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"
            }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
});

FormInput.displayName = "FormInput";
export default FormInput;
