# 🔧 Configuração do Token do GitHub

## ❌ Problema Atual
O sistema está salvando mensagens apenas no localStorage porque o token do GitHub não está configurado.

## ✅ Solução

### **Passo 1: Criar Token do GitHub**
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Dê um nome: `para-ela-vlog`
4. Selecione as permissões:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você não verá ele novamente!)

### **Passo 2: Configurar no Netlify**
1. Acesse o painel do Netlify
2. Vá em **Site settings** > **Environment variables**
3. Adicione:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: `seu_token_aqui` (cole o token que você copiou)
4. Clique em **Save**

### **Passo 3: Configurar Localmente (Opcional)**
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione:
   ```
   GITHUB_TOKEN=seu_token_aqui
   ```
3. Reinicie o servidor de desenvolvimento

### **Passo 4: Testar**
1. Poste uma mensagem
2. Verifique o console - deve mostrar:
   - "Token do GitHub configurado: Sim"
   - "Arquivo atualizado com sucesso"
3. Atualize a página - a mensagem deve persistir
4. Abra em outro dispositivo - a mensagem deve aparecer

## 🔍 Verificação
Para verificar se está funcionando:
1. Acesse: https://github.com/petersonwebb/para-ela/blob/main/vlog-messages.json
2. O arquivo deve conter suas mensagens

## 🚨 Importante
- **NUNCA** compartilhe o token
- **NUNCA** commite o arquivo `.env.local`
- O token tem permissões de escrita no repositório

## 📞 Suporte
Se ainda não funcionar, me envie os logs do console!
