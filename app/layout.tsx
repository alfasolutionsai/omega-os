"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  Bot,
  FolderKanban,
  DollarSign,
  Settings,
  Command,
} from "lucide-react"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { CommandPalette } from "@/components/command-palette"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "CRM", icon: Users, url: "/crm" },
  { title: "Agents", icon: Bot, url: "/agents" },
  { title: "Projets", icon: FolderKanban, url: "/projects" },
  { title: "Finance", icon: DollarSign, url: "/finance" },
  { title: "Settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Command className="h-6 w-6" />
          <span>OMEGA</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 text-xs text-muted-foreground">
        Alfa Solutions © 2026
      </SidebarFooter>
    </Sidebar>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 p-6 bg-muted/20">
                {children}
              </main>
            </div>
            <CommandPalette />
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}