"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Finance & Forecasting</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Encaissés</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenue.toLocaleString()} $</div>
            <p className="text-xs text-muted-foreground">
              {performance?.["Factures Payées"] || 0} factures réglées
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expensesTotal.toLocaleString()} $</div>
            <p className="text-xs text-muted-foreground">Coûts opérationnels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Net</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit.toLocaleString()} $
            </div>
            <p className="text-xs text-muted-foreground">Marge actuelle</p>
          </CardContent>
        </Card>
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
              <div className="flex items-center justify-between text-sm">
                <span>Discovery (0 deals)</span>
                <span className="text-muted-foreground">0 $</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Proposal (0 deals)</span>
                <span className="text-muted-foreground">0 $</span>
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