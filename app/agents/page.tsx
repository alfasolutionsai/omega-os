"use client"

import { useState } from "react"
import { ServerManagementTable } from "@/components/ui/server-management-table"
import Plan from "@/components/ui/agent-plan"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("monitor")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Centre de Contrôle Agents</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
            <TabsTrigger value="plan">Agent Plan</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="monitor" className="mt-0">
          <ServerManagementTable title="Agents Infrastructure" />
        </TabsContent>
        <TabsContent value="plan" className="mt-0">
          <Plan />
        </TabsContent>
      </Tabs>
    </div>
  )
}