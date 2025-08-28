import { GITHUB_CONFIG, getMessagesUrl, getApiUrl } from './github-config'
// ATENÇÃO: Para integração automática, crie um arquivo .env.local na raiz do projeto com:
// NEXT_PUBLIC_GITHUB_TOKEN=seu_token_aqui

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
    // Salvar no localStorage como backup
    localStorage.setItem('vlogEntries', JSON.stringify(messages))

    // INTEGRAÇÃO AUTOMÁTICA COM GITHUB
    // ATENÇÃO: Insira seu token de acesso pessoal do GitHub abaixo
    // Salvar no localStorage como backup
    localStorage.setItem('vlogEntries', JSON.stringify(messages));

    // Enviar para API segura
    try {
      const response = await fetch('/api/save-vlog-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
      });
      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao salvar no GitHub:', error);
        alert('Erro ao salvar no GitHub. Veja o console para detalhes.');
        return false;
      }
      console.log('Mensagens salvas automaticamente no GitHub!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
      alert('Erro ao salvar no GitHub. Veja o console para detalhes.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar mensagens:', error);
    alert('Erro ao salvar no GitHub. Veja o console para detalhes.');
    return false;
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
