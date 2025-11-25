"use client"

import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconBug,
  IconNews,
  IconHelp,
  IconSitemap,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import ProfileDropdown from "./kokonutui/profile-dropdown"

export interface User {
  name: string
  email: string
  avatar: string
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Playground",
      url: "/dashboard/user/playground",
      icon: IconBug,
    },
  ],
  navSecondary: [
     {
      title: "Get Help",
      url: "/issues/help",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      title: "Articles",
      url: "/dashboard/user/articles",
      icon: IconNews,
      name: "Articles",
    },
    {
      title: "Roadmap",
      url: "/dashboard/user/roadmap",
      icon: IconSitemap,
      name: "Roadmap",
    }
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Troooble Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <ProfileDropdown user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
