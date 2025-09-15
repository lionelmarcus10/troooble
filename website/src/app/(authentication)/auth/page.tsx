
import * as React from "react";
import { Auth } from "@/components/auth/auth-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (data && data?.user) {
    redirect('/dashboard')
  }
    
  return (
    <div className="w-full flex justify-center items-center min-h-screen p-4">
      <Auth />
    </div>
  );
}   