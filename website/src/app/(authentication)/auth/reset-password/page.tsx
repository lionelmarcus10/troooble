"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/app/actions/auth/action";
import { resetPasswordSchema } from "@/utils/zod/schemas";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface FormState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  success: boolean;
  verifyingSession: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isFromRecovery, setIsFromRecovery] = React.useState(false);
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
    showConfirmPassword: false,
    success: false,
    verifyingSession: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  // Verify the session on mount
  React.useEffect(() => {
    const verifySession = async () => {
      try {
        const supabase = createClient();

        // Check if redirected from recovery mode
        const urlParams = new URLSearchParams(window.location.search);
        const fromRecovery = urlParams.get('from') === 'recovery';
        setIsFromRecovery(fromRecovery);

        // Check if we have a valid session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          setFormState((prev) => ({
            ...prev,
            verifyingSession: false,
            error: "Invalid or expired reset link. Please request a new password reset."
          }));
          return;
        }

        // Session is valid
        setFormState((prev) => ({ ...prev, verifyingSession: false }));
      } catch (err) {
        setFormState((prev) => ({
          ...prev,
          verifyingSession: false,
          error: "Failed to verify reset link. Please try again."
        }));
      }
    };

    verifySession();
  }, []);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const authResponse = await resetPassword(formData);

      if (!authResponse) {
        // Success - password updated
        setFormState((prev) => ({
          ...prev,
          success: true,
          isLoading: false,
          error: null
        }));

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        return;
      }

      if (authResponse && "message" in authResponse) {
        setFormState((prev) => ({ ...prev, error: authResponse.message, isLoading: false }));
      } else if (Array.isArray(authResponse) && authResponse.length > 0) {
        const errorMessages = authResponse
          .map((error) => error.message || error)
          .join("\n- ");
        setFormState((prev) => ({ ...prev, error: `${errorMessages}`, isLoading: false }));
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        isLoading: false,
      }));
    }
  };

  // Show loading while verifying session
  if (formState.verifyingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10 flex flex-col items-center p-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h2 className="text-xl font-semibold text-foreground">
                Verifying reset link...
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your password reset link.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show success screen after password reset
  if (formState.success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10 flex flex-col items-center p-8 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground">
                Password updated!
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your password has been successfully updated. Redirecting to
                dashboard...
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirecting...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error screen if session verification failed
  if (formState.error && !formState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <div className="relative z-10 flex flex-col items-center p-8 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>

              <h1 className="text-2xl font-semibold text-foreground">
                Invalid Reset Link
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {formState.error}
              </p>

              <Button
                className="mt-6 w-full max-w-xs"
                onClick={() => router.push("/auth?view=forgot-password")}
              >
                Request new reset link
              </Button>

              <Button
                variant="outline"
                className="mt-3 w-full max-w-xs"
                onClick={() => router.push("/auth")}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mx-auto w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="relative z-10 p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-foreground">
                Reset password
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isFromRecovery
                  ? "You must change your password before accessing the dashboard"
                  : "Enter your new password below"
                }
              </p>
            </div>

            {isFromRecovery && (
              <div className="mb-6 animate-in rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
                <p className="font-medium">Password Change Required</p>
                <p className="mt-1 text-xs opacity-90">
                  For security reasons, you need to set a new password before you can access your dashboard.
                </p>
              </div>
            )}

            {formState.error && (
              <div className="mb-6 animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {formState.error.includes("-") ? (
                  <ul className="list-inside list-disc space-y-1">
                    {formState.error
                      .split("-")
                      .filter((item) => item.trim())
                      .map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                      ))}
                  </ul>
                ) : (
                  formState.error
                )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={formState.showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={formState.isLoading}
                    className={cn(errors.password && "border-destructive")}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        showPassword: !prev.showPassword,
                      }))
                    }
                    disabled={formState.isLoading}
                  >
                    {formState.showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrengthIndicator password={password || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={formState.showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={formState.isLoading}
                    className={cn(
                      errors.confirmPassword && "border-destructive"
                    )}
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        showConfirmPassword: !prev.showConfirmPassword,
                      }))
                    }
                    disabled={formState.isLoading}
                  >
                    {formState.showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={formState.isLoading}
              >
                {formState.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => router.push("/auth")}
                disabled={formState.isLoading}
              >
                Sign in
              </Button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
