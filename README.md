# 🏋️ Academia Fitness - Treino e Dieta

Uma aplicação web moderna e responsiva para gerenciar treinos e dieta, construída com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## ✨ Características

- 🎯 **Interface Moderna**: Design responsivo com Tailwind CSS
- 📱 **PWA**: Funciona offline e pode ser instalado no celular
- 🔐 **Autenticação Segura**: Login com email/senha e Google OAuth
- 💪 **Gestão de Treinos**: Crie e organize seus treinos por dias da semana
- 🍎 **Controle de Dieta**: Monitore refeições e macronutrientes
- 📊 **Acompanhamento**: Visualize seu progresso com gráficos
- 🗄️ **Banco de Dados**: Schema profissional em português
- 🔒 **Segurança**: Row Level Security (RLS) no Supabase

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Gerenciamento de formulários
- **React Hot Toast** - Notificações

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança de dados
- **Auth** - Autenticação e autorização

### PWA
- **next-pwa** - Configuração PWA
- **Service Worker** - Cache offline
- **Manifest** - Instalação no dispositivo

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/site-academia.git
cd site-academia
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

4. **Configure o Supabase**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o script `database_schema.sql` no SQL Editor
   - Copie a URL e chave anônima para o `.env.local`

5. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

6. **Acesse a aplicação**
```
http://localhost:3000
```

## 🗄️ Configuração do Banco de Dados

### 1. Remover tabelas existentes (se houver)
Execute o script `remove_existing_tables.sql` no Supabase SQL Editor.

### 2. Criar o schema
Execute o script `database_schema.sql` no Supabase SQL Editor.

### 3. Configurar autenticação
No Supabase Dashboard:
- Vá para Authentication > Settings
- Configure os providers desejados (Email, Google)
- Defina as URLs de redirecionamento

## 📱 PWA - Progressive Web App

A aplicação é uma PWA completa com:

- **Instalação**: Pode ser instalada no celular/desktop
- **Offline**: Funciona sem internet (dados em cache)
- **Notificações**: Push notifications (configurável)
- **Responsivo**: Otimizado para todos os dispositivos

### Instalação no Celular
1. Acesse o site no navegador
2. Toque no ícone "Instalar" na barra de endereços
3. Confirme a instalação

## 🎨 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard principal
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Button, Card, etc)
│   ├── layout/           # Layout components (Header, Footer)
│   ├── landing/          # Páginas de marketing
│   └── providers.tsx     # Context providers
├── lib/                  # Utilitários e configurações
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
└── types/                # Definições TypeScript
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Verificação de tipos
npm run type-check
```

## 🎯 Funcionalidades Principais

### 🏋️ Gestão de Treinos
- Criação de sessões de treino por dia da semana
- Exercícios organizados por grupos musculares
- Controle de séries, repetições e pesos
- Histórico de treinos realizados

### 🍎 Controle de Dieta
- Registro de refeições e produtos
- Cálculo automático de macronutrientes
- Tipos de alimento categorizados
- Acompanhamento de calorias

### 📊 Dashboard
- Visão geral do progresso
- Gráficos e estatísticas
- Metas e objetivos
- Histórico de atividades

## 🔒 Segurança

- **Row Level Security (RLS)**: Usuários só acessam seus próprios dados
- **Autenticação JWT**: Tokens seguros do Supabase
- **Validação de dados**: Zod para validação de formulários
- **HTTPS**: Conexões seguras em produção

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
- Netlify
- Railway
- DigitalOcean

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- Email: contato@academiafitness.com
- Discord: [Servidor da Comunidade](https://discord.gg/academiafitness)
- Issues: [GitHub Issues](https://github.com/seu-usuario/site-academia/issues)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes acessíveis
- [Framer Motion](https://www.framer.com/motion/) - Animações

---

Feito com ❤️ para a comunidade fitness brasileira



