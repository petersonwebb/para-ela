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
    
    // Primeiro, pegar o texto bruto para debug
    const rawText = await response.text();
    console.log('Texto bruto recebido:', rawText);
    
    // Tentar fazer parse do JSON
    let messages;
    try {
      messages = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      console.log('Conteúdo recebido que causou erro:', rawText);
      
      // Se o arquivo estiver vazio ou com apenas espaços, retornar array vazio
      if (!rawText.trim()) {
        console.log('Arquivo vazio, retornando array vazio');
        return [];
      }
      
      // Tentar limpar o conteúdo
      const cleanedText = rawText.trim();
      try {
        messages = JSON.parse(cleanedText);
      } catch (secondError) {
        console.error('Erro mesmo após limpeza:', secondError);
        console.log('Arquivo no GitHub está corrompido. Tentando recriar...');
        
        // Tentar recriar o arquivo com conteúdo do localStorage
        const savedMessages = localStorage.getItem('vlogEntries');
        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages);
            const success = await recreateGitHubFile(parsedMessages);
            if (success) {
              console.log('Arquivo recriado com sucesso!');
              return parsedMessages;
            }
          } catch (e) {
            console.error('Erro ao recriar arquivo:', e);
          }
        }
        
        return [];
      }
    }
    
    console.log('Mensagens carregadas do GitHub:', messages)
    
    // Se o GitHub estiver vazio, verificar localStorage
    if (!Array.isArray(messages) || messages.length === 0) {
      console.log('GitHub vazio, verificando localStorage...');
      const savedMessages = localStorage.getItem('vlogEntries');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          console.log('Mensagens encontradas no localStorage:', parsedMessages);
          return Array.isArray(parsedMessages) ? parsedMessages : [];
        } catch (e) {
          console.error('Erro ao carregar do localStorage:', e);
        }
      }
    }
    
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
        body: JSON.stringify(messages, null, 2) // Formatar JSON com indentação
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Mensagens salvas via API local!', result);
        return true;
      } else {
        const error = await response.json();
        console.error('Erro na API local:', error);
        console.log('Detalhes do erro:', error.details);
        
        // Se o erro for relacionado ao token, usar apenas localStorage
        if (error.details && error.details.includes('Token')) {
          console.log('Token do GitHub não configurado. Usando apenas localStorage.');
          return true; // Retorna true mesmo assim para não bloquear o usuário
        }
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
        body: JSON.stringify(messages, null, 2) // Formatar JSON com indentação
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

// Função para recriar o arquivo no GitHub (caso esteja corrompido)
export const recreateGitHubFile = async (messages: VlogEntry[]): Promise<boolean> => {
  try {
    console.log('Tentando recriar arquivo no GitHub...');
    
    // Tentar usar a API local primeiro
    try {
      const response = await fetch('/api/recreate-vlog-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages, null, 2)
      });
      
      if (response.ok) {
        console.log('Arquivo recriado via API local!');
        return true;
      }
    } catch (error) {
      console.log('API local não disponível para recriação');
    }
    
    // Tentar usar Netlify Function
    try {
      const response = await fetch('/.netlify/functions/recreate-vlog-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages, null, 2)
      });
      
      if (response.ok) {
        console.log('Arquivo recriado via Netlify Function!');
        return true;
      }
    } catch (error) {
      console.log('Netlify Function não disponível para recriação');
    }
    
    return false;
  } catch (error) {
    console.error('Erro ao recriar arquivo:', error);
    return false;
  }
}
