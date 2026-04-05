"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tour de Contrôle</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnel?.["Leads Totaux"] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {funnel?.["Contacts Enregistrés"] || 0} contacts enregistrés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Encaissés</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finance?.["Revenus Encaissés"] || 0} $</div>
            <p className="text-xs text-muted-foreground">
              {finance?.["Factures en Attente"] || 0} $ en attente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pipeline.reduce((acc, curr) => acc + (curr["Valeur Totale Estimée"] || 0), 0).toLocaleString()} $
            </div>
            <p className="text-xs text-muted-foreground">
              {pipeline.reduce((acc, curr) => acc + (curr["Nombre de Deals"] || 0), 0)} deals actifs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivité</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Actions agents Aujourd'hui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}