import fs from 'fs'
import path from 'path'

// Simulation simple de recherche sémantique/fuzzy sur les fichiers locaux
// Dans une version prod, on utiliserait un vector store (pgvector)

const WORKSPACE_ROOT = path.join(process.cwd(), '..') // Pointe vers /data/.openclaw/workspace

export async function searchMemory(query: string) {
  const results: { file: string; content: string; score: number }[] = []
  const filesToScan = [
    'MEMORY.md',
    'SOUL.md',
    'USER.md',
    'agents/engineering/AGENT.md',
    'agents/hr/AGENT.md'
  ]

  const lowerQuery = query.toLowerCase()

  for (const file of filesToScan) {
    try {
      const fullPath = path.join(WORKSPACE_ROOT, file)
      if (!fs.existsSync(fullPath)) continue
      
      const content = fs.readFileSync(fullPath, 'utf-8')
      const lines = content.split('\n')
      
      // Recherche simple par ligne contenant le terme
      const matches = lines.filter(line => line.toLowerCase().includes(lowerQuery))
      
      if (matches.length > 0) {
        results.push({
          file,
          content: matches.slice(0, 2).join(' ').substring(0, 150) + '...',
          score: matches.length
        })
      }
    } catch (e) {
      console.error(`Error reading ${file}:`, e)
    }
  }

  return results.sort((a, b) => b.score - a.score)
}