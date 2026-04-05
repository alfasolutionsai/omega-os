"use client"

import { useState } from "react"
import FileUpload from "@/components/ui/file-upload"
import TitleEditor from "@/components/ui/editable-components"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("gallery")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Centre de Documents</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="gallery" className="mt-0">
          <FileUpload />
        </TabsContent>
        <TabsContent value="editor" className="mt-0">
          <div className="max-w-4xl mx-auto">
            <TitleEditor 
              initialValue="Projet OMEGA OS - Documentation Technique"
              label="Nom du Document"
              description="Gérez les titres et métadonnées de vos documents."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}