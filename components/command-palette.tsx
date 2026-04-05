"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Bot,
  Search,
  Users,
  FolderKanban,
  TrendingUp,
  Command,
  FileText,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [memoryResults, setMemoryResults] = React.useState<any[]>([])
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (searchQuery.length > 2) {
      // Recherche dans la mémoire
      fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      })
      .then(res => res.json())
      .then(data => setMemoryResults(data.results || []))
    } else {
      setMemoryResults([])
    }
  }, [searchQuery])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Rechercher dans OMEGA, les Leads ou la Mémoire..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        
        {memoryResults.length > 0 && (
          <CommandGroup heading="Corporate Memory">
            {memoryResults.map((res, i) => (
              <CommandItem key={i} className="flex flex-col items-start py-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                  <FileText className="h-3 w-3" /> {res.file}
                </div>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {res.content}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { router.push("/"); setOpen(false) }}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => { router.push("/crm"); setOpen(false) }}>
            <Users className="mr-2 h-4 w-4" />
            <span>CRM</span>
          </CommandItem>
          <CommandItem onSelect={() => { router.push("/agents"); setOpen(false) }}>
            <Bot className="mr-2 h-4 w-4" />
            <span>Agents</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Nouveau Lead</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Bot className="mr-2 h-4 w-4" />
            <span>Lancer Prospection</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}