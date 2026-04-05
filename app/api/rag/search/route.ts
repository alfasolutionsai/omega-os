import { NextResponse } from 'next/server'
import { searchMemory } from '@/lib/rag-search'

export async function POST(req: Request) {
  const { query } = await req.json()
  
  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchMemory(query)
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}