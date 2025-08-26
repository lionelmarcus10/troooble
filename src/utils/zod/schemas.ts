import { z } from "zod";

// --------------------------------
// Schemas
// --------------------------------

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*=]/, "Password must contain at least one special character (!@#$%^&*)")
});

export const signUpSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[!@#$%^&*=]/, "Password must contain at least one special character (!@#$%^&*)"),
  terms: z.boolean().refine(val => val === true, { message: "You must agree to the terms" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});