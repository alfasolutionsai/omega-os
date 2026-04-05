"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface LeadEditSheetProps {
  lead: any
  trigger: React.ReactNode
  onUpdate: () => void
}

export function LeadEditSheet({ lead, trigger, onUpdate }: LeadEditSheetProps) {
  const [name, setName] = useState(lead.name || "")
  const [website, setWebsite] = useState(lead.website || "")
  const [status, setStatus] = useState(lead.status || "")
  const supabase = createClient()

  const handleSave = async () => {
    await supabase.from("companies").update({ name, website, status }).eq("id", lead.id)
    onUpdate()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Éditer le Lead</SheetTitle>
          <SheetDescription>Modifiez les informations de l'entreprise.</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Nom de l'entreprise</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="website">Site Web</Label>
            <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status">Statut</Label>
            <Input id="status" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="notes">Notes</Label>
            <Textarea placeholder="Ajouter des notes contextuelles..." />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleSave}>Enregistrer</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}