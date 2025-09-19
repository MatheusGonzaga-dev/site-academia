# 🚀 Guia de Instalação - Academia Fitness

Este guia vai te ajudar a configurar e executar o projeto Academia Fitness em sua máquina.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download aqui](https://nodejs.org/)
- **npm ou yarn** - Gerenciador de pacotes
- **Git** - [Download aqui](https://git-scm.com/)
- **Conta no Supabase** - [Criar conta](https://supabase.com)

## 🛠️ Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/site-academia.git
cd site-academia
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Supabase

#### 3.1. Crie um Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Digite o nome: `academia-fitness`
5. Crie uma senha forte para o banco
6. Escolha a região mais próxima (ex: South America - São Paulo)
7. Clique em "Create new project"

#### 3.2. Configure o Banco de Dados
1. No dashboard do Supabase, vá para **SQL Editor**
2. Execute primeiro o script `remove_existing_tables.sql` (se houver tabelas existentes)
3. Execute o script `database_schema.sql` para criar todas as tabelas
4. Execute o script `create_user_trigger.sql` para configurar triggers de usuário
5. Verifique se as tabelas foram criadas em **Table Editor**

#### 3.3. Configure a Autenticação
1. Vá para **Authentication > Settings**
2. Em **Site URL**, adicione: `http://localhost:3000`
3. Em **Redirect URLs**, adicione: `http://localhost:3000/dashboard`
4. Em **Providers**, configure:
   - **Email**: Ative
   - **Google** (opcional): Configure com suas credenciais OAuth

### 4. Configure as Variáveis de Ambiente

**Opção 1 - Automática (Recomendada):**
```bash
npm run setup
```

**Opção 2 - Manual:**
```bash
cp env.example .env.local
```

**Suas credenciais já estão configuradas no arquivo de exemplo:**
- ✅ **URL**: `https://rzojanygdumtbafpnhxy.supabase.co`
- ✅ **Chave**: Já configurada

**Se precisar de novas credenciais:**
- No Supabase Dashboard, vá para **Settings > API**
- **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** = `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Execute o Projeto

```bash
npm run dev
# ou
yarn dev
```

### 6. Acesse a Aplicação

Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

## 🎯 Primeiros Passos

### 1. Criar sua Conta
1. Clique em "Criar Conta Grátis"
2. Preencha seus dados
3. Confirme seu email (se necessário)

### 2. Configurar seu Perfil
1. Acesse o Dashboard
2. Vá para Configurações
3. Complete suas informações pessoais

### 3. Criar seu Primeiro Treino
1. Vá para "Treinos"
2. Clique em "Novo Treino"
3. Configure seu treino personalizado

### 4. Registrar sua Primeira Refeição
1. Vá para "Dieta"
2. Clique em "Registrar Refeição"
3. Adicione produtos à sua refeição

## 📱 PWA - Instalação no Celular

### Android (Chrome)
1. Acesse o site no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### iOS (Safari)
1. Acesse o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme a instalação

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint
```

## 🐛 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as URLs de redirecionamento estão configuradas

### Erro "You're importing a component that needs next/headers"
**Solução:** Este erro foi corrigido separando as funções de cliente e servidor:
- `src/lib/supabase.ts` - Para componentes cliente
- `src/lib/supabase-server.ts` - Para componentes servidor
- `src/lib/supabase-client.ts` - Cliente direto do Supabase

### Erro de Build
```bash
# Limpe o cache
rm -rf .next
npm run build
```

### Problemas com PWA
- Certifique-se de que está usando HTTPS em produção
- Verifique se o manifest.json está acessível
- Teste em diferentes navegadores

### Erro de Autenticação
- Verifique as configurações de autenticação no Supabase
- Confirme se as URLs de redirecionamento estão corretas
- Teste com diferentes provedores (email/Google)

## 📊 Estrutura do Banco de Dados

O banco possui as seguintes tabelas principais:

- **usuarios** - Dados dos usuários
- **musculos** - Grupos musculares
- **exercicios** - Exercícios disponíveis
- **sessoes_treino** - Treinos do usuário
- **exercicios_sessao** - Exercícios em cada treino
- **tipos_alimento** - Categorias de alimentos
- **produtos** - Produtos alimentícios
- **refeicoes** - Refeições registradas
- **historico_treinos** - Histórico de treinos
- **historico_refeicoes** - Histórico de refeições

## 🚀 Deploy em Produção

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Opções
- **Netlify**: Similar ao Vercel
- **Railway**: Para aplicações full-stack
- **DigitalOcean**: Para mais controle

## 📞 Suporte

Se encontrar problemas:

1. **Verifique este guia** primeiro
2. **Consulte o README.md** para mais detalhes
3. **Abra uma issue** no GitHub
4. **Entre em contato** via email

## 🎉 Pronto!

Agora você tem um sistema completo de treino e dieta funcionando! 

**Próximos passos:**
- Personalize o design conforme sua marca
- Adicione mais exercícios e produtos
- Configure notificações push
- Integre com wearables (Apple Watch, Fitbit)

---

**Boa sorte com seu projeto fitness! 💪**
