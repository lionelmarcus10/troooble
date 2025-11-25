'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod'
import { createClient } from '@/utils/supabase/server'
import { signInSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema, magicLinkSchema } from '@/utils/zod/schemas';
import { AuthError } from '@supabase/supabase-js'
import {  forgotPasswordMessage } from '@/utils/auth/utils'
import { cookies } from 'next/headers'
import { syncUserWithDatabase } from '../subscription/action'

export async function login(formData: FormData): Promise<null | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  // Validate inputs using zod

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validatedData = signInSchema.safeParse(rawData)

  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  const { error, data } = await supabase.auth.signInWithPassword(validatedData.data)

  if (error) {
    return error;
  }

  // Sync user with database for subscription tracking
  await syncUserWithDatabase()

  // Ensure Polar customer exists for returning user
  const { getOrCreatePolarCustomer } = await import('@/lib/polar-customer')
  await getOrCreatePolarCustomer()

  revalidatePath('/', 'layout')

  return null;
}

export async function signup(formData: FormData): Promise<null | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  // Validate inputs using zod
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
    terms: formData.get('terms') === 'true' ? true : false,
  }

  const validatedData = signUpSchema.safeParse(rawData)

  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  const { error, data } = await supabase.auth.signUp({
    email: validatedData.data.email,
    password: validatedData.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`,
      data: {
        fullName: validatedData.data.name,
      },
    },
  })

  if (error) {
    return error;
  }

  // Sync user with database for subscription tracking
  if (data.user) {
    await syncUserWithDatabase()

    // Create Polar customer for new user
    const { getOrCreatePolarCustomer } = await import('@/lib/polar-customer')
    await getOrCreatePolarCustomer()
  }

  revalidatePath('/', 'layout')

  return null;
}

export async function forgotPassword(formData: FormData): Promise<{ message: string; } | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  const rawData = {
    email: formData.get('email') as string,
  }

  const validatedData = forgotPasswordSchema.safeParse(rawData)
  
  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(validatedData.data.email,{
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`
  })

  if (error) {
    return error;
  }

  revalidatePath('/', 'layout')
  return {
    message : forgotPasswordMessage
  }
  
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return error;
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


export async function resetPassword(formData: FormData): Promise<null | { message: string } | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  const rawData = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedData = resetPasswordSchema.safeParse(rawData)

  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  const { error } = await supabase.auth.updateUser({
    password: validatedData.data.password
  })

  if (error) {
    return error;
  }

  // Clear the password reset flag cookie
  const cookieStore = await cookies()
  cookieStore.delete('needs_password_reset')

  revalidatePath('/', 'layout')
  return null;
}

export async function verifyOtp(formData: FormData): Promise<null | { message: string } | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  const rawData = {
    email: formData.get('email') as string,
    token: formData.get('token') as string,
  }

  const validatedData = verifyOtpSchema.safeParse(rawData)

  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  const { error } = await supabase.auth.verifyOtp({
    email: validatedData.data.email,
    token: validatedData.data.token,
    type: 'recovery'
  })

  if (error) {
    return error;
  }

  // Set cookie to mark this as a recovery session that needs password reset

  const cookieStore = await cookies()
  cookieStore.set('needs_password_reset', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour
  })

  revalidatePath('/', 'layout')
  return null;
}

export async function sendMagicLink(formData: FormData): Promise<{ message: string } | AuthError | z.core.$ZodIssue[]> {
  const supabase = await createClient()

  const rawData = {
    email: formData.get('email') as string,
  }

  const validatedData = magicLinkSchema.safeParse(rawData)

  if (!validatedData.success) {
    return validatedData.error.issues;
  }

  // Use shouldCreateUser: false to only sign in existing users
  const { error } = await supabase.auth.signInWithOtp({
    email: validatedData.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      shouldCreateUser: false,
    }
  })

  if (error) {
    // If user doesn't exist, return a generic message for security
    if (error.message.toLowerCase().includes('user not found') ||
        error.message.toLowerCase().includes('signup disabled')) {
      return {
        name: 'AuthError',
        message: 'No account found with this email address. Please sign up first.',
        status: 400
      } as AuthError;
    }
    return error;
  }

  revalidatePath('/', 'layout')
  return {
    message: 'Check your email for the magic link to sign in.'
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return null
}

export async function checkAuth(redirectTo?: string) {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth')
  }

  // Check if user has a pending password reset
  // This is set when they click the recovery link in their email

  const cookieStore = await cookies()
  const needsPasswordReset = cookieStore.get('needs_password_reset')

  if (needsPasswordReset?.value === 'true') {
    // User must reset their password before accessing protected routes
    redirect('/auth/reset-password?from=recovery')
  }

  if (redirectTo) {
    redirect(redirectTo)
  }
}

export async function resendVerificationEmail(email: string): Promise<{ message: string } | AuthError> {
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/dashboard`,
    }
  })

  if (error) {
    return error
  }

  return {
    message: 'Verification email sent! Please check your inbox.'
  }
}