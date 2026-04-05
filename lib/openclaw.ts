import { createClient } from '@/lib/supabase/client'

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || 'http://localhost:18789'
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN

export interface AgentStatus {
  id: string
  status: 'idle' | 'working' | 'blocked'
  lastActivity?: string
}

export async function getAgentStatus(agentId: string): Promise<AgentStatus | null> {
  try {
    // Simulation d'appel API Gateway (à adapter selon l'endpoint exact de ton OpenClaw)
    // const res = await fetch(`${GATEWAY_URL}/api/agents/${agentId}`, {
    //   headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` }
    // })
    // return res.json()
    
    return { id: agentId, status: 'idle', lastActivity: 'Just now' }
  } catch (error) {
    console.error('Failed to fetch agent status', error)
    return null
  }
}

export async function sendCommandToAgent(agentId: string, command: string) {
  const supabase = createClient()
  
  // 1. Log la commande dans Supabase pour traçabilité
  await supabase.from('agent_activities').insert({
    agent_id: agentId,
    action_type: 'command_sent_from_os',
    details: { command },
    executed_at: new Date().toISOString()
  })

  // 2. Envoyer la commande via l'API Gateway ou sessions_send
  // Pour l'instant, on simule l'envoi via un webhook ou un appel direct
  console.log(`Sending command to ${agentId}: ${command}`)
  
  return { success: true }
}

export async function approveAction(requestId: string) {
  const supabase = createClient()
  
  // Mettre à jour le statut dans la table d'approbations
  await supabase.from('approval_requests')
    .update({ status: 'approved' })
    .eq('id', requestId)

  // Notifier OpenClaw que l'approbation est donnée
  // sendCommandToAgent('gateway', `/approve ${requestId}`)
}