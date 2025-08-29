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
    console.log('Tentando carregar mensagens do GitHub...');
    const url = getMessagesUrl();
    console.log('URL do GitHub:', url);
    
    const response = await fetch(url)
    console.log('Resposta do GitHub:', response.status, response.statusText);
    
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

// Salvar mensagens no GitHub
export const saveMessagesToGitHub = async (messages: VlogEntry[]): Promise<boolean> => {
  try {
    console.log('Tentando salvar mensagens:', messages);
    
    // Salvar no localStorage como backup
    localStorage.setItem('vlogEntries', JSON.stringify(messages));
    console.log('Mensagens salvas no localStorage');

    // Tentar usar a API local primeiro (para desenvolvimento)
    try {
      console.log('Tentando usar API local...');
      const response = await fetch('/api/save-vlog-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
      });
      
      if (response.ok) {
        console.log('Mensagens salvas via API local!');
        return true;
      } else {
        const error = await response.json();
        console.error('Erro na API local:', error);
      }
    } catch (error) {
      console.log('API local não disponível, tentando Netlify Function...');
    }

    // Tentar usar Netlify Function (para produção)
    try {
      console.log('Tentando usar Netlify Function...');
      const response = await fetch('/.netlify/functions/save-vlog-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
      });
      
      if (response.ok) {
        console.log('Mensagens salvas via Netlify Function!');
        return true;
      } else {
        const error = await response.json();
        console.error('Erro na Netlify Function:', error);
        console.log('Token do GitHub não configurado. Mensagens salvas apenas localmente.');
        alert('Mensagens salvas localmente. Para salvar no GitHub, configure o token no Netlify.');
        return true; // Retorna true mesmo assim para não bloquear o usuário
      }
    } catch (error) {
      console.error('Erro ao acessar Netlify Function:', error);
      console.log('Mensagens salvas apenas localmente.');
      alert('Mensagens salvas localmente. Para salvar no GitHub, configure o token no Netlify.');
      return true; // Retorna true mesmo assim para não bloquear o usuário
    }
  } catch (error) {
    console.error('Erro geral ao salvar mensagens:', error);
    alert('Erro ao salvar mensagens. Veja o console para detalhes.');
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
