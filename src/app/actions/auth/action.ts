'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import z from 'zod'
import { createClient } from '@/utils/supabase/server'
import { signInSchema, signUpSchema, forgotPasswordSchema } from '@/utils/zod/schemas'; 
import { AuthError } from '@supabase/supabase-js'
import { createAccountMessage, forgotPasswordMessage } from '@/utils/auth/utils'

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

  revalidatePath('/', 'layout')

  if (!data.user?.email_confirmed_at) {
    redirect('/confirm-email')
  }

  redirect('/dashboard')

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

  const { error, data } = await supabase.auth.signUp(validatedData.data)

  if (error) {
    return error;
  }

  console.log('User signed up:', data)
  revalidatePath('/', 'layout')
  redirect('/auth/confirm-email')

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