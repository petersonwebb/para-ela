// Sistema de armazenamento compartilhado usando uma API simples e gratuita
// Usando httpbin.org como exemplo - você pode trocar por qualquer API de sua escolha

interface SharedData {
  moods: Record<string, any>
  treasures: Record<string, any>
  artCanvas: any
  lastUpdated: string
}

// Chave única para identificar os dados do casal
const COUPLE_ID = 'para-ela-couple-data'

// Função para buscar dados compartilhados
async function fetchSharedData(): Promise<SharedData> {
  try {
    // Usando uma API simples para demonstração
    // Em produção, use um serviço como Firebase, Supabase, ou similar
    const response = await fetch(`https://httpbin.org/get?couple_id=${COUPLE_ID}`)
    
    if (!response.ok) {
      throw new Error('Falha ao buscar dados')
    }
    
    const result = await response.json()
    
    // Se não há dados salvos, retorna estrutura vazia
    return result.data || {
      moods: {},
      treasures: {},
      artCanvas: null,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.log('Usando dados locais como fallback')
    return {
      moods: {},
      treasures: {},
      artCanvas: null,
      lastUpdated: new Date().toISOString()
    }
  }
}

// Função para salvar dados compartilhados
async function saveSharedData(data: SharedData): Promise<void> {
  try {
    // Simula salvamento - em produção use uma API real
    await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        couple_id: COUPLE_ID,
        data: {
          ...data,
          lastUpdated: new Date().toISOString()
        }
      })
    })
  } catch (error) {
    console.error('Erro ao salvar dados compartilhados:', error)
    throw error
  }
}

// Funções para mood
export async function savePublicMoodEntry(userName: string, mood: string) {
  const today = new Date().toISOString().split('T')[0]
  const key = `${userName}_${today}`
  
  try {
    const sharedData = await fetchSharedData()
    sharedData.moods[key] = {
      user_name: userName,
      mood,
      date: today,
      created_at: new Date().toISOString()
    }
    await saveSharedData(sharedData)
    return sharedData.moods[key]
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${today}`
    const data = { user_name: userName, mood, date: today, created_at: new Date().toISOString() }
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getPublicMoodEntry(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const key = `${userName}_${targetDate}`
  
  try {
    const sharedData = await fetchSharedData()
    return sharedData.moods[key] || null
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${targetDate}`
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey)
      return data ? JSON.parse(data) : null
    }
    return null
  }
}

// Funções para treasure
export async function savePublicTreasureProgress(userName: string, progress: number, unlocked: boolean) {
  const today = new Date().toISOString().split('T')[0]
  const key = `${userName}_${today}`
  
  try {
    const sharedData = await fetchSharedData()
    sharedData.treasures[key] = {
      user_name: userName,
      progress,
      unlocked,
      date: today,
      created_at: new Date().toISOString()
    }
    await saveSharedData(sharedData)
    return sharedData.treasures[key]
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${today}`
    const data = { user_name: userName, progress, unlocked, date: today, created_at: new Date().toISOString() }
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getPublicTreasureProgress(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const key = `${userName}_${targetDate}`
  
  try {
    const sharedData = await fetchSharedData()
    return sharedData.treasures[key] || null
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${targetDate}`
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey)
      return data ? JSON.parse(data) : null
    }
    return null
  }
}

// Funções para art canvas
export async function savePublicArtCanvas(canvasData: string, createdBy: string) {
  try {
    const sharedData = await fetchSharedData()
    sharedData.artCanvas = {
      canvas_data: canvasData,
      created_by: createdBy,
      created_at: new Date().toISOString()
    }
    await saveSharedData(sharedData)
    return sharedData.artCanvas
  } catch (error) {
    // Fallback para localStorage
    const localKey = 'latest_art_canvas'
    const data = { canvas_data: canvasData, created_by: createdBy, created_at: new Date().toISOString() }
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getPublicLatestArtCanvas() {
  try {
    const sharedData = await fetchSharedData()
    return sharedData.artCanvas
  } catch (error) {
    // Fallback para localStorage
    const localKey = 'latest_art_canvas'
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey)
      return data ? JSON.parse(data) : null
    }
    return null
  }
}
