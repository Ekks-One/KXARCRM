import React from 'react'
import {Menu, Calendar, LogOut, Database, Home, Inbox, Settings, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/pages/dashboard",
    icon: Home,
  },
  {
    title: "Database",
    url: "/pages/database",
    icon: Database,
  },
  {
    title: "Tasks",
    url: "/pages/tasks",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/pages/calendar",
    icon: Calendar,
  },
  {
    title: "Our Team",
    url: "/pages/teams",
    icon: Star,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Sign Out",
    url: "/",
    icon: LogOut,
  },
]

export const AppSidebar = () => {
  return (
    <Sidebar className="sticky top-0 h-screen border-r">
      <SidebarContent>
        <Link href="/pages/dashboard" className="flex items-center gap-3 px-3 py-3">
          <Image
            src="/KXARICON.png"
            alt="KXAR logo"
            width={50}
            height={50}
            priority
          />
          <span className="text-xl font-semibold tracking-tight text-gray-900">
            KXARCRM
          </span>
        </Link>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className = "space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5"/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
