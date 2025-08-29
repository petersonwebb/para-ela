# Instruções de Configuração

## Para tornar as funcionalidades totalmente operacionais:

### 1. Configurar Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie a URL e a anon key
5. Crie um arquivo `.env.local` na raiz do projeto com:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 2. Configurar o banco de dados

1. No Supabase, vá em SQL Editor
2. Execute o script que está em `sql/setup.sql`

### 3. Instalar dependências

Execute no terminal:
```bash
npm install
```

### 4. Executar o projeto

```bash
npm run dev
```

## Funcionalidades implementadas:

✅ **Check-in do humor** - Salva o humor diário de cada usuário
✅ **Caça ao tesouro digital** - Progresso salvo por usuário
✅ **Quadro de arte colaborativo** - Um desenho por vez, substituindo o anterior

## Como funciona:

- Cada usuário é identificado pelo nome (solicitado na primeira visita)
- Os dados são salvos no Supabase e sincronizados entre dispositivos
- O quadro de arte funciona como você pediu: quando alguém salva um novo desenho, ele substitui o anterior
- Sua namorada pode acessar o site e usar todas as funcionalidades

## Próximos passos:

1. Configure o Supabase seguindo as instruções acima
2. Teste todas as funcionalidades
3. Compartilhe o link do site com sua namorada
4. Divirtam-se! ❤️
