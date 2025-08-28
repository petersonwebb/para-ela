// Configuração do GitHub para mensagens públicas
export const GITHUB_CONFIG = {
  username: 'petersonwebb',
  repository: 'para-ela',
  branch: 'main',
  filePath: 'vlog-messages.json',
  apiUrl: 'https://api.github.com',
  rawUrl: 'https://raw.githubusercontent.com'
}

// URL para o arquivo de mensagens
export const getMessagesUrl = () => {
  return `${GITHUB_CONFIG.rawUrl}/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.filePath}`
}

// URL para a API do GitHub
export const getApiUrl = () => {
  return `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/contents/${GITHUB_CONFIG.filePath}`
}
