// Configuração do Supabase
// Para usar este sistema, você precisa:
// 1. Criar uma conta em https://supabase.com
// 2. Criar um novo projeto
// 3. Ir em Settings > API
// 4. Copiar a URL e anon key
// 5. Criar um arquivo .env.local com:
// NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
// NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
}
