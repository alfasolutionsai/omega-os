"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { sendCommandToAgent, approveAction } from "@/lib/openclaw"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, CheckCircle, XCircle, Clock, Activity, Play, StopCircle } from "lucide-react"

// Simulation des agents pour l'interface (en attendant la connexion API Gateway)
const MOCK_AGENTS = [
  { id: "alfa-sales", name: "Alfa Sales", status: "idle", lastAction: "Il y a 2h", type: "Prospection" },
  { id: "alfa-hr", name: "Alfa HR", status: "working", lastAction: "Vetting Lucas G.", type: "Recrutement" },
  { id: "alfa-engineering", name: "Alfa Engineering", status: "idle", lastAction: "Il y a 1j", type: "Développement" },
]

const MOCK_APPROVALS = [
  { id: "1", agent: "Alfa Sales", action: "Envoyer message LinkedIn", target: "Lucas Gargiulo", time: "Il y a 5 min" },
  { id: "2", agent: "Alfa HR", action: "Inviter développeur", target: "Toptal", time: "Il y a 12 min" },
]

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("monitor")
  const [activities, setActivities] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Tentative de récupération des activités réelles si la table existe
    const fetchActivities = async () => {
      const { data } = await supabase.from("agent_activities").select("*").order("executed_at", { ascending: false }).limit(10)
      if (data) setActivities(data)
    }
    fetchActivities()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Centre de Contrôle Agents</h1>
        <div className="flex gap-2">
          <Button variant={activeTab === "monitor" ? "default" : "outline"} onClick={() => setActiveTab("monitor")}>
            <Activity className="mr-2 h-4 w-4" /> Monitor
          </Button>
          <Button variant={activeTab === "approvals" ? "default" : "outline"} onClick={() => setActiveTab("approvals")}>
            <Clock className="mr-2 h-4 w-4" /> Approvals <Badge className="ml-2 bg-red-500">2</Badge>
          </Button>
        </div>
      </div>

      {activeTab === "monitor" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_AGENTS.map((agent) => (
            <Card key={agent.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                <Bot className={`h-4 w-4 ${agent.status === 'working' ? 'text-green-500' : 'text-muted-foreground'}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{agent.status}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {agent.lastAction}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 h-8" onClick={() => sendCommandToAgent(agent.id, "start")}><Play className="h-3 w-3 mr-1" /> Start</Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => sendCommandToAgent(agent.id, "stop")}><StopCircle className="h-3 w-3 mr-1" /> Stop</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Logs d'Activité (Temps Réel)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.length > 0 ? activities.map((act) => (
                    <TableRow key={act.id}>
                      <TableCell>{act.agent_id}</TableCell>
                      <TableCell>{act.action_type}</TableCell>
                      <TableCell>{new Date(act.executed_at).toLocaleString()}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Aucune activité récente enregistrée dans Supabase.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approbations en Attente</CardTitle>
              <CardDescription>Actions nécessitant votre validation avant exécution.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Cible / Détail</TableHead>
                    <TableHead>Reçu il y a</TableHead>
                    <TableHead className="text-right">Décision</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_APPROVALS.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.agent}</TableCell>
                      <TableCell>{req.action}</TableCell>
                      <TableCell>{req.target}</TableCell>
                      <TableCell>{req.time}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="default" className="h-8 bg-green-600 hover:bg-green-700" onClick={() => approveAction(req.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approuver
                          </Button>
                          <Button size="sm" variant="destructive" className="h-8" onClick={() => approveAction(req.id)}>
                            <XCircle className="h-3 w-3 mr-1" /> Refuser
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}