"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FinancialDashboard } from "@/components/ui/financial-dashboard"
import {
  ArrowLeftRight,
  CreditCard,
  LineChart,
  Target,
  TrendingUp,
  Users,
  ShieldCheck,
  SwitchCamera,
  Landmark,
} from "lucide-react"

export default function FinancePage() {
  const [performance, setPerformance] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: perfData } = await supabase.from("v_financial_performance").select("*").single()
      setPerformance(perfData)

      const { data: expData } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(5)
      setExpenses(expData || [])
    }
    fetchData()
  }, [])

  const revenue = performance?.["Revenus Encaissés"] || 0
  const expensesTotal = Math.abs(performance?.["Total Dépenses"] || 0)
  const profit = revenue - expensesTotal

  // Mapping des données pour le nouveau composant
  const quickActionsData = [
    { icon: ArrowLeftRight, title: 'Transfer', description: 'Virement' },
    { icon: Landmark, title: 'Factures', description: 'Gérer les paiements' },
    { icon: TrendingUp, title: 'Invest', description: 'Croissance' },
    { icon: CreditCard, title: 'Dépenses', description: 'Suivi des coûts' },
  ]

  const recentActivityData = expenses.map(exp => ({
    icon: LineChart,
    title: exp.description,
    time: new Date(exp.expense_date).toLocaleDateString(),
    amount: -exp.total
  }))

  const financialServicesData = [
    {
      icon: ShieldCheck,
      title: 'Forecasting',
      description: `Valeur Pipeline: ~64 800 $`,
      isPremium: true,
    },
    {
      icon: Target,
      title: 'Savings Goals',
      description: 'Objectifs financiers',
      hasAction: true,
    },
    {
      icon: SwitchCamera,
      title: 'Cash Flow',
      description: `Profit Net: ${profit.toLocaleString()} $`,
    },
    {
      icon: Users,
      title: 'Outbound',
      description: 'Activer sur 510 leads',
      hasAction: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Finance & Forecasting</h1>
      </div>

      <FinancialDashboard
        quickActions={quickActionsData}
        recentActivity={recentActivityData}
        financialServices={financialServicesData}
      />
      
      <div className="p-4 bg-card border border-border rounded-2xl text-center text-sm text-muted-foreground">
        💡 <strong>Conseil :</strong> Pour augmenter ton forecasting, active une séquence outbound sur tes 510 leads.
      </div>
    </div>
  )
}