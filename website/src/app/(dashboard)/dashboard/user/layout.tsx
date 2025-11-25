import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createClient } from "@/utils/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userData = {
    name: user?.user_metadata?.fullName || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/avatars/default.jpg',
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={userData} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <main className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
               {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}