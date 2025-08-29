// Sistema de armazenamento usando GitHub (mesmo esquema das mensagens)
import { GITHUB_CONFIG } from './github-config';

// URL para o arquivo de dados do casal
const getCoupleDataUrl = () => {
  return `${GITHUB_CONFIG.rawUrl}/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/${GITHUB_CONFIG.branch}/couple-data.json`
}

// Interface para os dados compartilhados
interface CoupleData {
  moods: Record<string, any>
  treasures: Record<string, any>
  artCanvas: any
  reactions: Array<{
    id: string
    type: string
    from_user: string
    created_at: string
    seen: boolean
  }>
  lastUpdated: string
}

// Função para buscar dados do GitHub
async function fetchCoupleData(): Promise<CoupleData> {
  try {
    const response = await fetch(getCoupleDataUrl() + '?t=' + Date.now());
    
    if (!response.ok) {
      throw new Error('Arquivo não encontrado');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Arquivo não existe ainda ou erro ao buscar, criando estrutura vazia');
    return {
      moods: {},
      treasures: {},
      artCanvas: null,
      reactions: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

// Função para salvar dados no GitHub via API
async function saveCoupleData(data: CoupleData): Promise<void> {
  try {
    const response = await fetch('/api/save-couple-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao salvar dados');
    }
  } catch (error) {
    console.error('Erro ao salvar dados no GitHub:', error);
    throw error;
  }
}

// Funções para mood
export async function saveGitHubMoodEntry(userName: string, mood: string) {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userName}_${today}`;
  
  try {
    const coupleData = await fetchCoupleData();
    coupleData.moods[key] = {
      user_name: userName,
      mood,
      date: today,
      created_at: new Date().toISOString()
    };
    await saveCoupleData(coupleData);
    return coupleData.moods[key];
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${today}`;
    const data = { user_name: userName, mood, date: today, created_at: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data));
    }
    throw error;
  }
}

export async function getGitHubMoodEntry(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const key = `${userName}_${targetDate}`;
  
  try {
    const coupleData = await fetchCoupleData();
    return coupleData.moods[key] || null;
  } catch (error) {
    // Fallback para localStorage
    const localKey = `mood_${userName}_${targetDate}`;
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

// Funções para treasure
export async function saveGitHubTreasureProgress(userName: string, progress: number, unlocked: boolean) {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userName}_${today}`;
  
  try {
    const coupleData = await fetchCoupleData();
    coupleData.treasures[key] = {
      user_name: userName,
      progress,
      unlocked,
      date: today,
      created_at: new Date().toISOString()
    };
    await saveCoupleData(coupleData);
    return coupleData.treasures[key];
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${today}`;
    const data = { user_name: userName, progress, unlocked, date: today, created_at: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(data));
    }
    throw error;
  }
}

export async function getGitHubTreasureProgress(userName: string, date?: string) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const key = `${userName}_${targetDate}`;
  
  try {
    const coupleData = await fetchCoupleData();
    return coupleData.treasures[key] || null;
  } catch (error) {
    // Fallback para localStorage
    const localKey = `treasure_${userName}_${targetDate}`;
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

// Funções para quadro de arte
export async function saveGitHubArtCanvas(canvasData: string, createdBy: string) {
  try {
    const coupleData = await fetchCoupleData();
    
    // Substituir o desenho anterior (só um por vez)
    coupleData.artCanvas = {
      canvas_data: canvasData,
      created_by: createdBy,
      created_at: new Date().toISOString()
    }
    
    await saveCoupleData(coupleData)
    return coupleData.artCanvas
  } catch (error) {
    console.error('Erro ao salvar arte no GitHub:', error)
    throw error
  }
}

export async function getGitHubLatestArtCanvas() {
  try {
    const coupleData = await fetchCoupleData();
    return coupleData.artCanvas;
  } catch (error) {
    // Fallback para localStorage
    const localKey = 'latest_art_canvas';
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(localKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }
}

// Funções para reações
export async function saveGitHubReaction(reactionType: string, fromUser: string) {
  try {
    const coupleData = await fetchCoupleData()
    
    // Inicializar reações se não existir
    if (!coupleData.reactions) {
      coupleData.reactions = []
    }
    
    // Adicionar nova reação
    const newReaction = {
      id: Date.now().toString(),
      type: reactionType,
      from_user: fromUser,
      created_at: new Date().toISOString(),
      seen: false
    }
    
    coupleData.reactions.push(newReaction)
    
    await saveCoupleData(coupleData)
    return newReaction
  } catch (error) {
    console.error('Erro ao salvar reação no GitHub:', error)
    throw error
  }
}

export async function getGitHubReactions() {
  try {
    const coupleData = await fetchCoupleData()
    return coupleData.reactions || []
  } catch (error) {
    console.error('Erro ao buscar reações do GitHub:', error)
    throw error
  }
}

export async function markGitHubReactionAsSeen(reactionId: string) {
  try {
    const coupleData = await fetchCoupleData()
    
    if (coupleData.reactions) {
      const reaction = coupleData.reactions.find(r => r.id === reactionId)
      if (reaction) {
        reaction.seen = true
        await saveCoupleData(coupleData)
      }
    }
    
    return true
  } catch (error) {
    console.error('Erro ao marcar reação como vista no GitHub:', error)
    throw error
  }
}
