import z from "zod";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../lib/apiFetch";
import type { User } from "../types";
import { WEB_ROUTES } from "../constants/webRoutes";
import { API_ROUTES } from "../constants/apiRoutes";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Button from "../components/Button";

const schema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);

    try {
      const { accessToken } = await apiFetch<{ accessToken: string }>(API_ROUTES.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const user = await apiFetch<User>(API_ROUTES.AUTH.ME, { token: accessToken });

      login(accessToken, user);
      navigate(WEB_ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Already have an account?"
      subtitleLinkText="Sign in"
      subtitleLinkHref={WEB_ROUTES.LOGIN}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {serverError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
