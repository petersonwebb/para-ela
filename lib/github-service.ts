import { GITHUB_CONFIG, getMessagesUrl, getApiUrl } from './github-config'

export interface VlogEntry {
  id: string
  date: string
  content: string
  image?: string
  timestamp: string
}

// Carregar mensagens do GitHub
export const loadMessagesFromGitHub = async (): Promise<VlogEntry[]> => {
  try {
    const response = await fetch(getMessagesUrl())
    if (!response.ok) {
      console.log('Arquivo de mensagens não encontrado, retornando array vazio')
      return []
    }
    
    const messages = await response.json()
    console.log('Mensagens carregadas do GitHub:', messages)
    return Array.isArray(messages) ? messages : []
  } catch (error) {
    console.error('Erro ao carregar mensagens do GitHub:', error)
    return []
  }
}

// Salvar mensagens no GitHub (simulado - você precisará de um token de acesso)
export const saveMessagesToGitHub = async (messages: VlogEntry[]): Promise<boolean> => {
  try {
    // Por enquanto, vamos salvar localmente e mostrar instruções
    console.log('Mensagens para salvar no GitHub:', messages)
    
    // Salvar no localStorage como backup
    localStorage.setItem('vlogEntries', JSON.stringify(messages))
    
    // Mostrar instruções para salvar manualmente
    console.log(`
      🚀 Para salvar no GitHub:
      1. Vá para: https://github.com/petersonwebb/para-ela
      2. Clique no arquivo vlog-messages.json
      3. Clique no ícone de lápis (editar)
      4. Cole este conteúdo:
      ${JSON.stringify(messages, null, 2)}
      5. Clique em "Commit changes"
    `)
    
    return true
  } catch (error) {
    console.error('Erro ao salvar mensagens:', error)
    return false
  }
}

// Verificar se há novas mensagens no GitHub
export const checkForUpdates = async (currentMessages: VlogEntry[]): Promise<VlogEntry[]> => {
  try {
    const githubMessages = await loadMessagesFromGitHub()
    
    // Comparar mensagens atuais com as do GitHub
    if (JSON.stringify(githubMessages) !== JSON.stringify(currentMessages)) {
      console.log('Novas mensagens encontradas no GitHub!')
      return githubMessages
    }
    
    return currentMessages
  } catch (error) {
    console.error('Erro ao verificar atualizações:', error)
    return currentMessages
  }
}
