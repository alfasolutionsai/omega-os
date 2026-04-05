"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardMetricCard, { TrendType } from "@/components/ui/dashboard-overview"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react"

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

  // Détermination des tendances (Simulées pour l'instant, ou basées sur une logique simple)
  const revenueTrend: TrendType = revenue > 0 ? "up" : "neutral"
  const expenseTrend: TrendType = expensesTotal > 0 ? "up" : "neutral" // Plus de dépenses = tendance "up" mais en rouge
  const profitTrend: TrendType = profit > 0 ? "up" : "down"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Finance & Forecasting</h1>
      </div>

      {/* Metric Cards avec Tendances */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Revenus Encaissés"
          value={`${revenue.toLocaleString()} $`}
          icon={DollarSign}
          trendChange={`${performance?.["Factures Payées"] || 0} factures`}
          trendType={revenueTrend}
        />
        <DashboardMetricCard
          title="Dépenses Totales"
          value={`${expensesTotal.toLocaleString()} $`}
          icon={CreditCard}
          trendChange="Coûts opérationnels"
          trendType={expenseTrend}
          className="[&_.trend-text]:text-red-500" // Hack pour forcer la couleur si besoin
        />
        <DashboardMetricCard
          title="Profit Net"
          value={`${profit.toLocaleString()} $`}
          icon={TrendingUp}
          trendChange={profit >= 0 ? "Marge positive" : "Marge négative"}
          trendType={profitTrend}
        />
         <DashboardMetricCard
          title="Factures en Attente"
          value={`${performance?.["Factures en Attente"] || 0} $`}
          icon={TrendingDown}
          trendChange="À recouvrer"
          trendType="neutral"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dernières Dépenses</CardTitle>
            <CardDescription>Historique récent des coûts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.description}</TableCell>
                    <TableCell>{new Date(exp.expense_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right text-red-500">-{exp.total} $</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecasting Pipeline</CardTitle>
            <CardDescription>Potentiel de revenu basé sur les deals en cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valeur Totale Pipeline</span>
              <span className="text-sm font-bold text-blue-600">~64 800 $</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Lead Generated (2 deals)</span>
                <span className="text-muted-foreground">64 800 $</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              💡 <strong>Conseil :</strong> Pour augmenter ton forecasting, active une séquence outbound sur tes 510 leads.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}