"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { forgotPassword, login, signup, sendMagicLink, verifyOtp, signInWithGoogle, resendVerificationEmail } from "@/app/actions/auth/action";
import { signInSchema, signUpSchema, forgotPasswordSchema, magicLinkSchema, verifyOtpSchema } from "@/utils/zod/schemas";
import { useQueryState, parseAsStringEnum } from 'nuqs'
import { checkMailMessage, createAccountMessage, forgotPasswordMessage } from "@/utils/auth/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";

// --------------------------------
// Types and Enums
// --------------------------------

enum AuthView {
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
  FORGOT_PASSWORD = "forgot-password",
  RESET_SUCCESS = "reset-success",
  MAGIC_LINK = "magic-link",
  MAGIC_LINK_SUCCESS = "magic-link-success",
  VERIFY_OTP = "verify-otp",
}

interface AuthState {
  view: AuthView;
}

interface FormState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
}

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type MagicLinkFormValues = z.infer<typeof magicLinkSchema>;
type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

// --------------------------------
// Main Auth Component
// --------------------------------

function Auth({ className, ...props }: React.ComponentProps<"div">) {


  const [view, setView] = useQueryState('view', 
    parseAsStringEnum<AuthView>(Object.values(AuthView)).withDefault(AuthView.SIGN_IN)
  );

  return (
    <div
      data-slot="auth"
      className={cn("mx-auto w-full max-w-md", className)}
      {...props}
    >
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/80 shadow-xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {view === AuthView.SIGN_IN && (
              <AuthSignIn
                key="sign-in"
                onForgotPassword={() => setView(AuthView.FORGOT_PASSWORD)}
                onSignUp={() => setView(AuthView.SIGN_UP)}
                onMagicLink={() => setView(AuthView.MAGIC_LINK)}
              />
            )}
            {view === AuthView.SIGN_UP && (
              <AuthSignUp
                key="sign-up"
                onSignIn={() => setView(AuthView.SIGN_IN)}
              />
            )}
            {view === AuthView.FORGOT_PASSWORD && (
              <AuthForgotPassword
                key="forgot-password"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onSuccess={() => setView(AuthView.RESET_SUCCESS)}
                onVerifyOtp={() => setView(AuthView.VERIFY_OTP)}
              />
            )}
            {view === AuthView.RESET_SUCCESS && (
              <AuthResetSuccess
                key="reset-success"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onVerifyOtp={() => setView(AuthView.VERIFY_OTP)}
              />
            )}
            {view === AuthView.MAGIC_LINK && (
              <AuthMagicLink
                key="magic-link"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onSuccess={() => setView(AuthView.MAGIC_LINK_SUCCESS)}
              />
            )}
            {view === AuthView.MAGIC_LINK_SUCCESS && (
              <AuthMagicLinkSuccess
                key="magic-link-success"
                onSignIn={() => setView(AuthView.SIGN_IN)}
              />
            )}
            {view === AuthView.VERIFY_OTP && (
              <AuthVerifyOtp
                key="verify-otp"
                onSignIn={() => setView(AuthView.SIGN_IN)}
                onBack={() => setView(AuthView.FORGOT_PASSWORD)}
                onForgotPassword={() => setView(AuthView.FORGOT_PASSWORD)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --------------------------------
// Shared Components
// --------------------------------

interface AuthFormProps {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  className?: string;
}

function AuthForm({ onSubmit, children, className }: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      data-slot="auth-form"
      className={cn("space-y-6", className)}
    >
      {children}
    </form>
  );
}

interface AuthErrorProps {
  message: string | null;
}

function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;
  return (
    <div
      data-slot="auth-error"
      className="mb-6 animate-in rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
    >
      {message.includes('-') ? (
        <ul className="list-disc list-inside space-y-1">
          {message.split('-').filter(item => item.trim()).map((item, index) => (
            <li key={index}>{item.trim()}</li>
          ))}
        </ul>
      ) : (
        message
      )}
    </div>
  );
}

interface AuthSocialButtonsProps {
  isLoading: boolean;
}

function AuthSocialButtons({ isLoading }: AuthSocialButtonsProps) {
  return (
    <div data-slot="auth-social-buttons" className="w-full mt-6">
      <Button
        variant="outline"
        className="w-full h-12 bg-background/50 border-border/50"
        disabled={isLoading}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Google
      </Button>
    </div>
  );
}

interface AuthSeparatorProps {
  text?: string;
}

function AuthSeparator({ text = "Or continue with" }: AuthSeparatorProps) {
  return (
    <div data-slot="auth-separator" className="relative mt-6">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}

// --------------------------------
// Sign In Component
// --------------------------------

interface AuthSignInProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onMagicLink: () => void;
}

function AuthSignIn({ onForgotPassword, onSignUp, onMagicLink }: AuthSignInProps) {
  const router = useRouter();
  const [searchParams] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  });
  const [needsVerification, setNeedsVerification] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    setNeedsVerification(false);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const authResponse = await login(formData);

      if (!authResponse) {
        router.push(redirectTo);
        return;
      }

      if (authResponse && 'message' in authResponse) {
        // Check if error is about email not confirmed
        if (authResponse.message.toLowerCase().includes('email not confirmed')) {
          setNeedsVerification(true);
          setUserEmail(data.email);
          setFormState((prev) => ({
            ...prev,
            error: "Please verify your email address before signing in. Check your inbox for the verification link."
          }));
        } else {
          setFormState((prev) => ({ ...prev, error: authResponse.message }));
        }
      }

      else if (Array.isArray(authResponse) && authResponse.length > 0) {
        // Display toast with multiple error points
        const errorMessages = authResponse.map((error: any) => error.message || error).join('\n- ');
        setFormState((prev) => ({ ...prev, error: `${errorMessages}` }));
     }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    setFormState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await resendVerificationEmail(userEmail);
      if ('message' in result) {
        toast.success(result.message);
        setNeedsVerification(false);
        setFormState((prev) => ({ ...prev, error: null }));
      } else {
        toast.error("Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      data-slot="auth-sign-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <AuthError message={formState.error} />

      {needsVerification && (
        <div className="mb-6 animate-in rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm">
          <p className="font-medium text-primary">Verification Required</p>
          <p className="mt-1 text-xs text-primary/90">
            Didn't receive the email?{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-xs underline"
              onClick={handleResendVerification}
              disabled={formState.isLoading}
            >
              Resend verification email
            </Button>
          </p>
        </div>
      )}

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={onForgotPassword}
              disabled={formState.isLoading}
            >
              Forgot password?
            </Button>
          </div>
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
                setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
              }
              disabled={formState.isLoading}
            >
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </AuthForm>

      <AuthSeparator />

      <div className="space-y-3 mt-6">
        <Button
          variant="outline"
          className="w-full h-12 bg-background/50 border-border/50"
          disabled={formState.isLoading}
          onClick={async () => {
            setFormState((prev) => ({ ...prev, isLoading: true }));
            try {
              await signInWithGoogle();
            } catch (error) {
              setFormState((prev) => ({
                ...prev,
                error: "Failed to sign in with Google",
                isLoading: false
              }));
            }
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 bg-background/50 border-border/50"
          disabled={formState.isLoading}
          onClick={onMagicLink}
        >
          <MailCheck className="mr-2 h-4 w-4" />
          Sign in with Magic Link
        </Button>
      </div>

       <p className="mt-8 text-center text-sm text-muted-foreground">
        No account ?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignUp}
          disabled={formState.isLoading}
        >
          Create one
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Sign Up Component
// --------------------------------

interface AuthSignUpProps {
  onSignIn: () => void;
}

function AuthSignUp({ onSignIn }: AuthSignUpProps) {
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
  });

  const terms = watch("terms");
  const password = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('terms', data.terms.toString());

      const authResponse = await signup(formData);

      if (!authResponse) {
        toast(createAccountMessage, {
          description: checkMailMessage,
          action: {
            label: "Undo",
            onClick: () => toast.dismiss(),
          }
        });
        onSignIn();
      }

      if (authResponse && 'message' in authResponse) {
        setFormState((prev) => ({ ...prev, error: authResponse.message }));
      } 

      else if (Array.isArray(authResponse) && authResponse.length > 0) {
        // Display toast with multiple error points
        const errorMessages = authResponse.map((error: any) => error.message || error).join('\n- ');
        setFormState((prev) => ({ ...prev, error: `${errorMessages}` }));
      }

    } catch {
      setFormState((prev) => ({ ...prev, error: "An unexpected error occurred" }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      data-slot="auth-sign-up"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Get started with your account</p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={formState.isLoading}
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
                setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
              }
              disabled={formState.isLoading}
            >
              {formState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          <PasswordStrengthIndicator password={password || ""} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(checked) => setValue("terms", checked === true)}
            disabled={formState.isLoading}
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms
            </Label>
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Terms
              </Button>{" "}
              and{" "}
              <Button variant="link" className="h-auto p-0 text-xs">
                Privacy Policy
              </Button>
              .
            </p>
          </div>
        </div>
        {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </AuthForm>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Forgot Password Component
// --------------------------------

interface AuthForgotPasswordProps {
  onSignIn: () => void;
  onSuccess: () => void;
  onVerifyOtp: () => void;
}

function AuthForgotPassword({ onSignIn, onSuccess, onVerifyOtp }: AuthForgotPasswordProps) {
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const authResponse = await forgotPassword(formData);
      
      if (authResponse && Array.isArray(authResponse) && authResponse.length > 0) {
        // Display toast with multiple error points
        const errorMessages = authResponse.map((error: any) => error.message || error).join('\n- ');
        setFormState((prev) => ({ ...prev, error: `${errorMessages}` }));
     } else if (authResponse && 'message' in authResponse && authResponse.message === forgotPasswordMessage) {
        onSuccess();
      }
      
    } catch (error) {
      setFormState((prev) => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      data-slot="auth-forgot-password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={onSignIn}
        disabled={formState.isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to receive a reset link
        </p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </AuthForm>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Or verify with email code{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={onVerifyOtp}
            disabled={formState.isLoading}
          >
            Enter OTP
          </Button>
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Reset Success Component
// --------------------------------

interface AuthResetSuccessProps {
  onSignIn: () => void;
  onVerifyOtp: () => void;
}

function AuthResetSuccess({ onSignIn, onVerifyOtp }: AuthResetSuccessProps) {
  return (
    <motion.div
      data-slot="auth-reset-success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center p-8 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {forgotPasswordMessage}
      </p>

      <Button
        variant="outline"
        className="mt-6 w-full max-w-xs"
        onClick={onSignIn}
      >
        Back to sign in
      </Button>

      <p className="mt-6 text-xs text-muted-foreground">
        No email? Check spam or{" "}
        <Button variant="link" className="h-auto p-0 text-xs" onClick={onSignIn}>
          try another email
        </Button>
      </p>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        Have a reset code?{" "}
        <Button variant="link" className="h-auto p-0 text-xs" onClick={onVerifyOtp}>
          Enter code
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Magic Link Component
// --------------------------------

interface AuthMagicLinkProps {
  onSignIn: () => void;
  onSuccess: () => void;
}

function AuthMagicLink({ onSignIn, onSuccess }: AuthMagicLinkProps) {
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: MagicLinkFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const authResponse = await sendMagicLink(formData);

      if (authResponse && Array.isArray(authResponse) && authResponse.length > 0) {
        const errorMessages = authResponse.map((error: any) => error.message || error).join('\n- ');
        setFormState((prev) => ({ ...prev, error: `${errorMessages}` }));
      } else if (authResponse && 'message' in authResponse) {
        onSuccess();
      }

    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      data-slot="auth-magic-link"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={onSignIn}
        disabled={formState.isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Magic Link</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to receive a sign-in link
        </p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send magic link"
          )}
        </Button>
      </AuthForm>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Button
          variant="link"
          className="h-auto p-0 text-sm"
          onClick={onSignIn}
          disabled={formState.isLoading}
        >
          Sign in
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Magic Link Success Component
// --------------------------------

interface AuthMagicLinkSuccessProps {
  onSignIn: () => void;
}

function AuthMagicLinkSuccess({ onSignIn }: AuthMagicLinkSuccessProps) {
  return (
    <motion.div
      data-slot="auth-magic-link-success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center p-8 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MailCheck className="h-8 w-8 text-primary" />
      </div>

      <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've sent you a magic link to sign in. Click the link in the email to continue.
      </p>

      <Button
        variant="outline"
        className="mt-6 w-full max-w-xs"
        onClick={onSignIn}
      >
        Back to sign in
      </Button>

      <p className="mt-6 text-xs text-muted-foreground">
        No email? Check spam or{" "}
        <Button variant="link" className="h-auto p-0 text-xs" onClick={onSignIn}>
          try another email
        </Button>
      </p>
    </motion.div>
  );
}

// --------------------------------
// Verify OTP Component
// --------------------------------

interface AuthVerifyOtpProps {
  onSignIn: () => void;
  onBack: () => void;
  onForgotPassword?: () => void;
}

function AuthVerifyOtp({ onSignIn, onBack, onForgotPassword }: AuthVerifyOtpProps) {
  const router = useRouter();
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    error: null,
    showPassword: false,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { email: "", token: "" },
  });

  const onSubmit = async (data: VerifyOtpFormValues) => {
    setFormState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('token', data.token);

      const authResponse = await verifyOtp(formData);

      if (!authResponse) {
        toast.success("OTP verified! Redirecting to reset password...");
        router.push('/auth/reset-password');
        return;
      }

      if (authResponse && 'message' in authResponse) {
        setFormState((prev) => ({ ...prev, error: authResponse.message }));
      } else if (Array.isArray(authResponse) && authResponse.length > 0) {
        const errorMessages = authResponse.map((error: any) => error.message || error).join('\n- ');
        setFormState((prev) => ({ ...prev, error: `${errorMessages}` }));
      }

    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <motion.div
      data-slot="auth-verify-otp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="p-8"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        onClick={onBack}
        disabled={formState.isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Enter reset code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the 6-digit code from your email
        </p>
      </div>

      <AuthError message={formState.error} />

      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={formState.isLoading}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="token">Reset Code</Label>
          <Input
            id="token"
            type="text"
            placeholder="123456"
            maxLength={6}
            disabled={formState.isLoading}
            className={cn("text-center text-2xl tracking-widest", errors.token && "border-destructive")}
            {...register("token")}
          />
          {errors.token && <p className="text-xs text-destructive">{errors.token.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify code"
          )}
        </Button>
      </AuthForm>

      <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground">
        <p>
          Didn't receive a code?{" "}
          <Button
            variant="link"
            className="h-auto p-0 text-sm"
            onClick={onBack}
            disabled={formState.isLoading}
          >
            Request new code
          </Button>
        </p>

        {formState.error && onForgotPassword && (
          <p className="pt-3 border-t border-border/50">
            Having trouble with the code?{" "}
            <Button
              variant="link"
              className="h-auto p-0 text-sm"
              onClick={onForgotPassword}
              disabled={formState.isLoading}
            >
              Reset your password instead
            </Button>
          </p>
        )}
      </div>
    </motion.div>
  );
}

// --------------------------------
// Exports
// --------------------------------

export {
  Auth,
  AuthSignIn,
  AuthSignUp,
  AuthForgotPassword,
  AuthResetSuccess,
  AuthMagicLink,
  AuthMagicLinkSuccess,
  AuthVerifyOtp,
  AuthForm,
  AuthError,
  AuthSocialButtons,
  AuthSeparator,
};

