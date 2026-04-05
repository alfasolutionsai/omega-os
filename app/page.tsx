"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MarketingDashboard } from "@/components/ui/dashboard-1"
import CardDisplay, { CardDisplayItem } from "@/components/ui/data-card-display"
import { Users, DollarSign, Bot, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const [funnel, setFunnel] = useState<any>(null)
  const [finance, setFinance] = useState<any>(null)
  const [pipeline, setPipeline] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: funnelData } = await supabase.from("v_sales_funnel").select("*").single()
      const { data: financeData } = await supabase.from("v_financial_performance").select("*").single()
      const { data: pipelineData } = await supabase.from("v_pipeline_value").select("*")
      
      setFunnel(funnelData)
      setFinance(financeData)
      setPipeline(pipelineData || [])
    }
    fetchData()
  }, [])

  // Préparation des Data Cards
  const displayItems: CardDisplayItem[] = [
    {
      id: "leads",
      title: "Leads Totaux",
      value: (funnel?.["Leads Totaux"] || 0).toString(),
      description: `${funnel?.["Contacts Enregistrés"] || 0} contacts enregistrés`,
      icon: Users,
      actionLabel: "Voir CRM",
      onActionClick: () => window.location.href = "/crm"
    },
    {
      id: "revenue",
      title: "Revenus Encaissés",
      value: `${finance?.["Revenus Encaissés"] || 0} $`,
      description: `${finance?.["Factures en Attente"] || 0} $ en attente`,
      icon: DollarSign,
      actionLabel: "Voir Finance",
      onActionClick: () => window.location.href = "/finance"
    },
    {
      id: "pipeline",
      title: "Valeur Pipeline",
      value: `${pipeline.reduce((acc, curr) => acc + (curr["Valeur Totale Estimée"] || 0), 0).toLocaleString()} $`,
      description: `${pipeline.reduce((acc, curr) => acc + (curr["Nombre de Deals"] || 0), 0)} deals actifs`,
      icon: TrendingUp,
      actionLabel: "Détails",
      onActionClick: () => console.log("Pipeline details")
    },
    {
      id: "agents",
      title: "Productivité",
      value: "0",
      description: "Actions agents Aujourd'hui",
      icon: Bot,
      actionLabel: "Monitorer",
      onActionClick: () => window.location.href = "/agents"
    }
  ]

  // Préparation du Marketing Dashboard
  const teamActivities = {
    totalHours: 12.5, // À remplacer par des données réelles plus tard
    stats: [
      { label: "Prospection", value: 45, color: "bg-blue-500" },
      { label: "Vetting", value: 25, color: "bg-lime-400" },
      { label: "Admin", value: 15, color: "bg-slate-400" },
    ]
  }

  const team = {
    memberCount: 3,
    members: [
      { id: "1", name: "Sales Bot", avatarUrl: "https://i.pravatar.cc/150?u=sales" },
      { id: "2", name: "HR Bot", avatarUrl: "https://i.pravatar.cc/150?u=hr" },
      { id: "3", name: "Eng Bot", avatarUrl: "https://i.pravatar.cc/150?u=eng" },
    ]
  }

  return (
    <div className="space-y-8 p-4">
      <CardDisplay items={displayItems} className="p-0" />
      
      <MarketingDashboard
        teamActivities={teamActivities}
        team={team}
        cta={{
          text: "Lancer une nouvelle séquence de prospection",
          buttonText: "Go to CRM",
          onButtonClick: () => window.location.href = "/crm"
        }}
        onFilterClick={() => {}}
      />
    </div>
  )
}