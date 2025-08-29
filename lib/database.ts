import { supabase } from './supabase'

// Tipos para o banco de dados
export interface MoodEntry {
  id?: string
  user_name: string
  mood: string
  date: string
  created_at?: string
}


export interface TreasureProgress {
  id?: string
  user_name: string
  progress: number
  unlocked: boolean
  date: string
  created_at?: string
}

export interface ArtCanvas {
  id?: string
  canvas_data: string
  created_by: string
  created_at?: string
}

// Funções para mood check-in
export async function saveMoodEntry(userName: string, mood: string) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('mood_entries')
    .upsert({
      user_name: userName,
      mood,
      date: today
    }, {
      onConflict: 'user_name,date'
    })
  
  if (error) throw error
  return data
}

export async function getMoodEntry(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_name', userName)
    .eq('date', targetDate)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}


// Funções para caça ao tesouro
export async function saveTreasureProgress(userName: string, progress: number, unlocked: boolean) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('treasure_progress')
    .upsert({
      user_name: userName,
      progress,
      unlocked,
      date: today
    }, {
      onConflict: 'user_name,date'
    })
  
  if (error) throw error
  return data
}

export async function getTreasureProgress(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('treasure_progress')
    .select('*')
    .eq('user_name', userName)
    .eq('date', targetDate)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Funções para quadro de arte
export async function saveArtCanvas(canvasData: string, createdBy: string) {
  // Primeiro, deletar o desenho anterior (só um por vez)
  await supabase.from('art_canvas').delete().neq('id', 0)
  
  const { data, error } = await supabase
    .from('art_canvas')
    .insert({
      canvas_data: canvasData,
      created_by: createdBy
    })
  
  if (error) throw error
  return data
}

export async function getLatestArtCanvas() {
  const { data, error } = await supabase
    .from('art_canvas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Função para obter nome do usuário (simples identificação)
export function getUserName(): string {
  if (typeof window === 'undefined') return 'usuario'
  
  let userName = localStorage.getItem('user_name')
  if (!userName) {
    userName = prompt('Qual é o seu nome?') || 'usuario'
    localStorage.setItem('user_name', userName)
  }
  return userName
}
