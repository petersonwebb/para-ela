import { supabase } from './supabase'
import { SUPABASE_CONFIG } from './config'
import { 
  saveGitHubMoodEntry, 
  getGitHubMoodEntry,
  saveGitHubTreasureProgress,
  getGitHubTreasureProgress,
  saveGitHubArtCanvas,
  getGitHubLatestArtCanvas,
  saveGitHubReaction,
  getGitHubReactions,
  markGitHubReactionAsSeen
} from './github-storage'

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

// Verificar se Supabase está configurado
const isSupabaseConfigured = () => {
  return SUPABASE_CONFIG.url !== 'https://your-project.supabase.co' && 
         SUPABASE_CONFIG.anonKey !== 'your-anon-key'
}

// Funções de fallback para localStorage
const saveToLocalStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

const getFromLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  return null
}

// Funções para mood check-in
export async function saveMoodEntry(userName: string, mood: string) {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    return await saveGitHubMoodEntry(userName, mood)
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
    
    if (isSupabaseConfigured()) {
      try {
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
      } catch (supabaseError) {
        console.log('Supabase também falhou, usando localStorage')
      }
    }
    
    // Fallback final para localStorage
    const today = new Date().toISOString().split('T')[0]
    const key = `mood_${userName}_${today}`
    const data = { user_name: userName, mood, date: today, created_at: new Date().toISOString() }
    saveToLocalStorage(key, data)
    return data
  }
}

export async function getMoodEntry(userName: string, date?: string) {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    const data = await getGitHubMoodEntry(userName, date)
    if (data) return data
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
  }
  
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_name', userName)
        .eq('date', targetDate)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      if (data) return data
    } catch (error) {
      console.log('Supabase também falhou, usando localStorage')
    }
  }
  
  // Fallback final para localStorage
  const key = `mood_${userName}_${targetDate}`
  return getFromLocalStorage(key)
}


// Funções para caça ao tesouro
export async function saveTreasureProgress(userName: string, progress: number, unlocked: boolean) {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    return await saveGitHubTreasureProgress(userName, progress, unlocked)
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
    
    if (isSupabaseConfigured()) {
      try {
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
      } catch (supabaseError) {
        console.log('Supabase também falhou, usando localStorage')
      }
    }
    
    // Fallback final para localStorage
    const today = new Date().toISOString().split('T')[0]
    const key = `treasure_${userName}_${today}`
    const data = { user_name: userName, progress, unlocked, date: today, created_at: new Date().toISOString() }
    saveToLocalStorage(key, data)
    return data
  }
}

export async function getTreasureProgress(userName: string, date?: string) {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    const data = await getGitHubTreasureProgress(userName, date)
    if (data) return data
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
  }
  
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('treasure_progress')
        .select('*')
        .eq('user_name', userName)
        .eq('date', targetDate)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      if (data) return data
    } catch (error) {
      console.log('Supabase também falhou, usando localStorage')
    }
  }
  
  // Fallback final para localStorage
  const key = `treasure_${userName}_${targetDate}`
  return getFromLocalStorage(key)
}

// Funções para quadro de arte
export async function saveArtCanvas(canvasData: string, createdBy: string) {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    return await saveGitHubArtCanvas(canvasData, createdBy)
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
    
    if (isSupabaseConfigured()) {
      try {
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
      } catch (supabaseError) {
        console.log('Supabase também falhou, usando localStorage')
      }
    }
    
    // Fallback final para localStorage
    const key = 'latest_art_canvas'
    const data = { canvas_data: canvasData, created_by: createdBy, created_at: new Date().toISOString() }
    saveToLocalStorage(key, data)
    return data
  }
}

export async function getLatestArtCanvas() {
  // Prioridade: GitHub > Supabase > localStorage
  try {
    const data = await getGitHubLatestArtCanvas()
    if (data) return data
  } catch (error) {
    console.log('GitHub falhou, tentando Supabase...')
  }
  
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('art_canvas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      if (data) return data
    } catch (error) {
      console.log('Supabase também falhou, usando localStorage')
    }
  }
  
  // Fallback final para localStorage
  const key = 'latest_art_canvas'
  return getFromLocalStorage(key)
}

// Funções para reações
export async function saveReaction(reactionType: string, fromUser: string) {
  // Prioridade: GitHub > localStorage
  try {
    return await saveGitHubReaction(reactionType, fromUser)
  } catch (error) {
    console.log('GitHub falhou, usando localStorage')
    
    // Fallback para localStorage
    const key = 'reactions'
    const reactions = getFromLocalStorage(key) || []
    const newReaction = {
      id: Date.now().toString(),
      type: reactionType,
      from_user: fromUser,
      created_at: new Date().toISOString(),
      seen: false
    }
    reactions.push(newReaction)
    saveToLocalStorage(key, reactions)
    return newReaction
  }
}

export async function getReactions() {
  // Prioridade: GitHub > localStorage
  try {
    return await getGitHubReactions()
  } catch (error) {
    console.log('GitHub falhou, usando localStorage')
    
    // Fallback para localStorage
    const key = 'reactions'
    return getFromLocalStorage(key) || []
  }
}

export async function markReactionAsSeen(reactionId: string) {
  // Prioridade: GitHub > localStorage
  try {
    return await markGitHubReactionAsSeen(reactionId)
  } catch (error) {
    console.log('GitHub falhou, usando localStorage')
    
    // Fallback para localStorage
    const key = 'reactions'
    const reactions = getFromLocalStorage(key) || []
    const reaction = reactions.find((r: any) => r.id === reactionId)
    if (reaction) {
      reaction.seen = true
      saveToLocalStorage(key, reactions)
    }
    return true
  }
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
