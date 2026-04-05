"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, Save, Mail, Link as LinkedinIcon, Plus, Trash2 } from "lucide-react"

export default function TemplateStudioPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase.from("sequence_templates").select("*").order("created_at", { ascending: false })
      if (data) setTemplates(data)
    }
    fetchTemplates()
  }, [])

  const handleSave = async () => {
    if (!selectedTemplate) return
    // Update logic would go here via Supabase API
    alert("Sauvegarde simulée : " + selectedTemplate.name)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Template Studio</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Nouveau Template</Button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sidebar: Liste des templates */}
        <div className="col-span-3 overflow-y-auto space-y-2 pr-2">
          {templates.map((t) => (
            <Card 
              key={t.id} 
              className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedTemplate?.id === t.id ? 'border-blue-500 bg-blue-50' : ''}`}
              onClick={() => setSelectedTemplate(t)}
            >
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {t.channel === 'email' ? <Mail className="h-4 w-4" /> : <LinkedinIcon className="h-4 w-4" />}
                  {t.name}
                </CardTitle>
                <div className="flex gap-1 mt-1">
                  <Badge variant="secondary" className="text-[10px] h-5">{t.channel}</Badge>
                  <Badge variant="outline" className="text-[10px] h-5">Var. {t.variant}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main: Éditeur */}
        <div className="col-span-9 flex flex-col gap-6 min-h-0">
          {selectedTemplate ? (
            <>
              <Card className="flex-1 flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">Nom du Template</CardTitle>
                      <Input 
                        value={selectedTemplate.name} 
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                      />
                    </div>
                    <div className="w-1/3">
                      <CardTitle className="text-base mb-2">Canal</CardTitle>
                      <Tabs value={selectedTemplate.channel} onValueChange={(v) => setSelectedTemplate({...selectedTemplate, channel: v})}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="email">Email</TabsTrigger>
                          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
                  {selectedTemplate.channel === 'email' && (
                    <div>
                      <label className="text-sm font-medium">Objet (Subject)</label>
                      <Input 
                        className="mt-1.5"
                        // Accessing nested JSON steps for the subject
                        defaultValue={selectedTemplate.steps ? JSON.parse(selectedTemplate.steps)[0]?.subject : ""}
                        onChange={(e) => {
                          const steps = JSON.parse(selectedTemplate.steps)
                          steps[0].subject = e.target.value
                          setSelectedTemplate({...selectedTemplate, steps: JSON.stringify(steps)})
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium mb-1.5">Contenu (Variables: {'{{name}}'}, {'{{company}}'})</label>
                    <Textarea 
                      className="flex-1 min-h-[200px] font-mono text-sm resize-none"
                      defaultValue={selectedTemplate.steps ? JSON.parse(selectedTemplate.steps)[0]?.content : ""}
                      onChange={(e) => {
                        const steps = JSON.parse(selectedTemplate.steps)
                        steps[0].content = e.target.value
                        setSelectedTemplate({...selectedTemplate, steps: JSON.stringify(steps)})
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4 flex-shrink-0">
                  <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline"><Copy className="mr-2 h-4 w-4" /> Dupliquer</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Enregistrer</Button>
                  </div>
                </CardFooter>
              </Card>
              {/* Prévisualisation (Simulation) */}
              <Card className="bg-muted/30">
                <CardHeader className="py-3">
                  <CardTitle className="text-xs uppercase text-muted-foreground">Aperçu</CardTitle>
                </CardHeader>
                <CardContent className="py-3 text-sm text-muted-foreground">
                  {selectedTemplate.channel === 'email' && (
                    <div className="space-y-2">
                      <p><strong>Objet:</strong> {selectedTemplate.steps ? JSON.parse(selectedTemplate.steps)[0]?.subject : "..."}</p>
                      <div className="whitespace-pre-wrap font-mono">
                        {selectedTemplate.steps ? JSON.parse(selectedTemplate.steps)[0]?.content : "..."}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
              Sélectionnez un template pour commencer l'édition
            </div>
          )}
        </div>
      </div>
    </div>
  )
}