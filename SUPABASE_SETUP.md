# 🚀 Configuração do Supabase para Mensagens Públicas

## O que é o Supabase?
O Supabase é um serviço gratuito que funciona como um "Firebase open source" - ele fornece um banco de dados PostgreSQL em nuvem com API automática.

## 📋 Passo a Passo para Configurar

### 1. Criar Conta no Supabase
- Acesse [https://supabase.com](https://supabase.com)
- Clique em "Start your project"
- Faça login com GitHub ou crie uma conta

### 2. Criar Novo Projeto
- Clique em "New Project"
- Escolha sua organização
- Digite um nome para o projeto (ex: "para-ela-vlog")
- Escolha uma senha forte para o banco
- Escolha a região mais próxima (ex: São Paulo)
- Clique em "Create new project"

### 3. Aguardar Configuração
- O projeto levará alguns minutos para ser criado
- Aguarde até aparecer "Project is ready"

### 4. Configurar Banco de Dados
- No menu lateral, clique em "SQL Editor"
- Clique em "New query"
- Cole e execute este código SQL:

```sql
-- Criar tabela para as mensagens do vlog
CREATE TABLE vlog_entries (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  image TEXT,
  date TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Configurar políticas de segurança (RLS)
ALTER TABLE vlog_entries ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer pessoa leia as mensagens
CREATE POLICY "Permitir leitura pública" ON vlog_entries
  FOR SELECT USING (true);

-- Permitir que qualquer pessoa insira mensagens
CREATE POLICY "Permitir inserção pública" ON vlog_entries
  FOR INSERT WITH CHECK (true);

-- Permitir que qualquer pessoa delete mensagens
CREATE POLICY "Permitir deleção pública" ON vlog_entries
  FOR DELETE USING (true);
```

### 5. Obter Credenciais da API
- No menu lateral, clique em "Settings" (ícone de engrenagem)
- Clique em "API"
- Copie:
  - **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
  - **anon public** key (ex: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 6. Configurar Variáveis de Ambiente
- Na raiz do seu projeto, crie um arquivo chamado `.env.local`
- Adicione estas linhas (substitua pelos valores reais):

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua_url_aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 7. Reiniciar o Servidor
- Pare o servidor de desenvolvimento (Ctrl+C)
- Execute novamente: `pnpm dev`

## ✅ Como Funciona Agora

### **Antes (localStorage):**
- ❌ Mensagens só apareciam no dispositivo que postou
- ❌ Não sincronizava entre dispositivos
- ❌ Mensagens perdidas ao limpar cache

### **Agora (Supabase):**
- ✅ Mensagens aparecem para TODOS que acessam o site
- ✅ Funciona em qualquer dispositivo
- ✅ Mensagens ficam salvas permanentemente
- ✅ Sincronização automática em tempo real

## 🔧 Testando

1. **Poste uma mensagem** no seu PC
2. **Abra o site no celular** - a mensagem aparecerá automaticamente
3. **Poste do celular** - aparecerá no PC também
4. **Compartilhe o link** com outras pessoas - elas verão todas as mensagens

## 🚨 Solução de Problemas

### Erro "Invalid API key"
- Verifique se as credenciais estão corretas no `.env.local`
- Reinicie o servidor após alterar o arquivo

### Erro "relation does not exist"
- Execute o código SQL na seção 4 novamente
- Verifique se a tabela foi criada em "Table Editor"

### Mensagens não aparecem
- Verifique o console do navegador para erros
- Confirme se as políticas RLS estão configuradas corretamente

## 💰 Custos

- **Plano Gratuito**: 500MB de banco, 2GB de transferência
- **Para uso pessoal**: Completamente gratuito
- **Sem limite de tempo**: Para sempre

## 🎯 Próximos Passos

Após configurar, você pode:
- Adicionar autenticação de usuários
- Implementar likes/comentários
- Adicionar notificações em tempo real
- Criar backup automático das mensagens

---

**🎉 Parabéns!** Agora suas mensagens são realmente públicas e aparecem para qualquer pessoa que acesse o site!
