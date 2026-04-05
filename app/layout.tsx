"use client"

import * as React from "react"
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { CommandPalette } from "@/components/command-palette"
import { SessionNavBar } from "@/components/ui/sidebar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <div className="flex min-h-screen w-full">
            <SessionNavBar />
            <main className="ml-[3.05rem] flex-1 p-6 bg-muted/20 transition-all">
              {children}
            </main>
          </div>
          <CommandPalette />
        </TooltipProvider>
      </body>
    </html>
  )
}