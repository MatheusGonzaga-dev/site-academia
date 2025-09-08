# 🚀 Guia de Deploy - Minha Academia

Este guia vai te ajudar a hospedar seu site de academia gratuitamente com banco de dados na nuvem.

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Supabase (gratuita)
- Conta no Vercel ou Netlify (gratuita)

## 🗄️ Passo 1: Configurar Supabase (Banco de Dados)

### 1.1 Criar conta no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"

### 1.2 Configurar o projeto
1. **Nome do projeto**: `minha-academia`
2. **Senha do banco**: Crie uma senha forte
3. **Região**: Escolha a mais próxima (ex: South America - São Paulo)
4. Clique em "Create new project"

### 1.3 Configurar o banco de dados
1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie todo o conteúdo do arquivo `database/schema.sql`
4. Cole no editor e clique em **Run**

### 1.4 Obter credenciais
1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa)

## 🌐 Passo 2: Deploy no Vercel (Recomendado)

### 2.1 Preparar o projeto
1. Faça commit do seu código no GitHub
2. Crie o arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 2.2 Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **New Project**
4. Importe seu repositório
5. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: Sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY`: Sua chave anon do Supabase
6. Clique em **Deploy**

### 2.3 Configurar domínio (opcional)
1. No dashboard do Vercel, vá para **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções

## 🌐 Alternativa: Deploy no Netlify

### 2.1 Preparar o projeto
1. Execute `npm run build` localmente
2. Faça commit da pasta `dist` no GitHub

### 2.2 Deploy no Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Faça login com GitHub
3. Clique em **New site from Git**
4. Escolha seu repositório
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Vá para **Site settings** → **Environment variables**
7. Adicione as variáveis do Supabase
8. Clique em **Deploy site**

## 🔧 Passo 3: Configurações Finais

### 3.1 Testar a aplicação
1. Acesse sua URL de deploy
2. Vá para **Configurações** no app
3. Verifique se o Supabase está configurado
4. Clique em "Carregar Dados de Exemplo"

### 3.2 Configurar domínio personalizado (opcional)
1. **Vercel**: Settings → Domains → Add Domain
2. **Netlify**: Site settings → Domain management → Add custom domain

## 📱 Passo 4: PWA (App Mobile)

### 4.1 Instalar como app
1. No mobile, acesse sua URL
2. No Chrome: Menu → "Adicionar à tela inicial"
3. No Safari: Compartilhar → "Adicionar à Tela de Início"

### 4.2 Configurar PWA (avançado)
1. Adicione `manifest.json` na pasta `public`
2. Configure service worker para funcionar offline

## 🛡️ Segurança

### Configurações importantes:
- ✅ RLS (Row Level Security) ativado
- ✅ Políticas de segurança configuradas
- ✅ Chaves de API protegidas
- ✅ HTTPS obrigatório

## 💰 Custos

### Gratuito para sempre:
- **Supabase**: 500MB de banco, 2GB de transferência
- **Vercel**: 100GB de bandwidth, deploys ilimitados
- **Netlify**: 100GB de bandwidth, 300 minutos de build

### Se precisar de mais:
- **Supabase Pro**: $25/mês (8GB banco, 250GB transferência)
- **Vercel Pro**: $20/mês (1TB bandwidth, domínios ilimitados)

## 🔄 Backup e Restore

### Backup automático:
- Supabase faz backup automático diário
- Vercel/Netlify mantém histórico de deploys

### Backup manual:
1. No Supabase: Settings → Database → Backups
2. Exporte seus dados via SQL ou CSV

## 🆘 Troubleshooting

### Problemas comuns:

**Erro de CORS:**
- Verifique se as URLs estão corretas no Supabase
- Settings → API → Site URL

**Dados não aparecem:**
- Verifique as variáveis de ambiente
- Confirme se o schema foi executado

**Deploy falha:**
- Verifique se todas as dependências estão no package.json
- Confirme se as variáveis de ambiente estão configuradas

## 📞 Suporte

- **Supabase**: [Discord](https://discord.supabase.com)
- **Vercel**: [Documentação](https://vercel.com/docs)
- **Netlify**: [Documentação](https://docs.netlify.com)

---

## 🎉 Parabéns!

Seu site de academia está no ar! Agora você pode:
- ✅ Acessar de qualquer lugar
- ✅ Dados salvos na nuvem
- ✅ Backup automático
- ✅ Funciona em mobile
- ✅ Totalmente gratuito

**URL do seu site**: `https://seu-projeto.vercel.app`
