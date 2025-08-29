// Sistema simples de banco de dados usando JSONBin.io (gratuito)
// Alternativa ao Supabase para dados compartilhados publicamente

const JSONBIN_API_KEY = '$2a$10$your-api-key-here' // Substitua pela sua chave
const BIN_ID = 'your-bin-id-here' // Substitua pelo ID do seu bin

// Interface para os dados compartilhados
interface SharedData {
  moods: Record<string, any>
  treasures: Record<string, any>
  artCanvas: any
  lastUpdated: string
}

// Função para buscar dados do JSONBin
async function fetchSharedData(): Promise<SharedData> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    })
    
    if (!response.ok) {
      throw new Error('Falha ao buscar dados')
    }
    
    const data = await response.json()
    return data.record
  } catch (error) {
    console.log('Erro ao buscar dados compartilhados:', error)
    return {
      moods: {},
      treasures: {},
      artCanvas: null,
      lastUpdated: new Date().toISOString()
    }
  }
}

// Função para salvar dados no JSONBin
async function saveSharedData(data: SharedData): Promise<void> {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString()
      })
    })
    
    if (!response.ok) {
      throw new Error('Falha ao salvar dados')
    }
  } catch (error) {
    console.error('Erro ao salvar dados compartilhados:', error)
    throw error
  }
}

// Funções públicas para mood
export async function saveSharedMoodEntry(userName: string, mood: string) {
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
    localStorage.setItem(localKey, JSON.stringify(data))
    return data
  }
}

export async function getSharedMoodEntry(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const key = `${userName}_${targetDate}`
  
  try {
    const sharedData = await fetchSharedData()
    return sharedData.moods[key] || null
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${targetDate}`
    const data = localStorage.getItem(localKey)
    return data ? JSON.parse(data) : null
  }
}

// Funções públicas para treasure
export async function saveSharedTreasureProgress(userName: string, progress: number, unlocked: boolean) {
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
    localStorage.setItem(localKey, JSON.stringify(data))
    return data
  }
}

export async function getSharedTreasureProgress(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const key = `${userName}_${targetDate}`
  
  try {
    const sharedData = await fetchSharedData()
    return sharedData.treasures[key] || null
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${targetDate}`
    const data = localStorage.getItem(localKey)
    return data ? JSON.parse(data) : null
  }
}

// Funções públicas para art canvas
export async function saveSharedArtCanvas(canvasData: string, createdBy: string) {
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
    localStorage.setItem(localKey, JSON.stringify(data))
    return data
  }
}

export async function getSharedLatestArtCanvas() {
  try {
    const sharedData = await fetchSharedData()
    return sharedData.artCanvas
  } catch (error) {
    // Fallback para localStorage
    const localKey = 'latest_art_canvas'
    const data = localStorage.getItem(localKey)
    return data ? JSON.parse(data) : null
  }
}
