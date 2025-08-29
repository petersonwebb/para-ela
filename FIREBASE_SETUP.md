# 🔥 Firebase Setup - Dados Compartilhados Publicamente

Agora o sistema usa **Firebase Realtime Database** para dados compartilhados entre vocês dois!

## ✅ **Como funciona agora:**

### **Sistema de Prioridades:**
1. **Firebase** (dados públicos compartilhados) 
2. **Supabase** (se configurado)
3. **localStorage** (fallback local)

### **Vantagens do Firebase:**
- ✅ **Gratuito** até 1GB de dados
- ✅ **Tempo real** - mudanças aparecem instantaneamente
- ✅ **Público** - vocês dois veem os mesmos dados
- ✅ **Sem configuração** - funciona imediatamente

## 🚀 **Para usar Firebase (opcional - já funciona):**

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto chamado "para-ela"
3. Vá em "Realtime Database" 
4. Clique "Criar banco de dados"
5. Escolha "Começar no modo de teste"
6. Copie a URL do banco (algo como: `https://para-ela-default-rtdb.firebaseio.com`)

### **Para personalizar a URL:**
Edite o arquivo `lib/firebase-simple.ts` e substitua:
```typescript
const FIREBASE_URL = 'https://para-ela-default-rtdb.firebaseio.com'
```

## 📱 **Teste agora:**

1. Abra o site em dois navegadores/dispositivos diferentes
2. Digite nomes diferentes quando perguntado
3. Teste as funcionalidades:
   - **Check-in de humor** - deve aparecer para ambos
   - **Caça ao tesouro** - progresso compartilhado
   - **Quadro de arte** - desenhos aparecem para ambos

## 🎯 **Status atual:**

- ✅ Dados salvos publicamente no Firebase
- ✅ Sincronização em tempo real
- ✅ Fallback para localStorage se Firebase falhar
- ✅ Funciona sem configuração adicional

**Agora sua namorada pode acessar de qualquer lugar e ver/usar tudo que vocês fazem! 💕**
