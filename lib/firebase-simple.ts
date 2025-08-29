// Sistema simples usando Firebase Realtime Database (gratuito)
// Mais confiável que APIs de teste

const FIREBASE_URL = 'https://para-ela-default-rtdb.firebaseio.com'

// Função para salvar dados no Firebase
async function saveToFirebase(path: string, data: any) {
  try {
    const response = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error('Erro ao salvar no Firebase')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro Firebase:', error)
    throw error
  }
}

// Função para buscar dados do Firebase
async function getFromFirebase(path: string) {
  try {
    const response = await fetch(`${FIREBASE_URL}/${path}.json`)
    
    if (!response.ok) {
      throw new Error('Erro ao buscar do Firebase')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro Firebase:', error)
    return null
  }
}

// Funções para mood
export async function saveFirebaseMoodEntry(userName: string, mood: string) {
  const today = new Date().toISOString().split('T')[0]
  const data = {
    user_name: userName,
    mood,
    date: today,
    created_at: new Date().toISOString()
  }
  
  try {
    await saveToFirebase(`moods/${userName}/${today}`, data)
    return data
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${today}`
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getFirebaseMoodEntry(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  try {
    const data = await getFromFirebase(`moods/${userName}/${targetDate}`)
    return data
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
export async function saveFirebaseTreasureProgress(userName: string, progress: number, unlocked: boolean) {
  const today = new Date().toISOString().split('T')[0]
  const data = {
    user_name: userName,
    progress,
    unlocked,
    date: today,
    created_at: new Date().toISOString()
  }
  
  try {
    await saveToFirebase(`treasures/${userName}/${today}`, data)
    return data
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${today}`
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getFirebaseTreasureProgress(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  
  try {
    const data = await getFromFirebase(`treasures/${userName}/${targetDate}`)
    return data
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
export async function saveFirebaseArtCanvas(canvasData: string, createdBy: string) {
  const data = {
    canvas_data: canvasData,
    created_by: createdBy,
    created_at: new Date().toISOString()
  }
  
  try {
    await saveToFirebase('art_canvas/latest', data)
    return data
  } catch (error) {
    // Fallback para localStorage
    const localKey = 'latest_art_canvas'
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data))
    }
    return data
  }
}

export async function getFirebaseLatestArtCanvas() {
  try {
    const data = await getFromFirebase('art_canvas/latest')
    return data
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
