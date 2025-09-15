"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Newspaper,
  SquareTerminal,
  TrafficCone 
} from "lucide-react"

import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import ProfileDropdown from "./kokonutui/profile-dropdown"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Troooble Inc.",
      logo: () => <Image src="/logo.svg" alt="Troooble Inc." width={200} height={200} className="rounded-sm" />,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Playground",
      url: "/dashboard/playground",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Roadmap",
      url: "/dashboard/roadmap",
      icon: TrafficCone,
      isActive: false,
    },
    {
      title: "Articles",
      url: "/dashboard/articles",
      icon: Newspaper,
      isActive: false,
    },
  ],
  projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        <ProfileDropdown className="" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
