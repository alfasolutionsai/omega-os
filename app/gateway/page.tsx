"use client"

import { GlowingAiChatAssistant } from "@/components/ui/glowing-ai-chat-assistant"

export default function GatewayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Passerelle OMEGA</h1>
      </div>
      <GlowingAiChatAssistant />
    </div>
  )
}