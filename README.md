# 💪 Minha Academia - Personal Fitness Tracker

Um aplicativo moderno e completo para controle de treinos, dieta e progresso físico, construído com as melhores tecnologias web.

## 🚀 Tecnologias Utilizadas

- **React 18** com **TypeScript** - Interface moderna e type-safe
- **Vite** - Build tool super rápido
- **Tailwind CSS** - Estilização utilitária e responsiva
- **Zustand** - Gerenciamento de estado simples e eficiente
- **React Router** - Navegação SPA
- **Lucide React** - Ícones modernos
- **date-fns** - Manipulação de datas

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral dos treinos da semana
- Resumo nutricional do dia
- Estatísticas de progresso
- Controle de hidratação

### 🏋️ Treinos
- Criação e edição de treinos personalizados
- Controle de séries, repetições e cargas
- Histórico de treinos realizados
- Sistema de templates de treino

### 📅 Agenda
- Calendário visual dos treinos
- Programação de treinos futuros
- Visualização mensal e diária
- Status de conclusão

### 🥗 Dieta
- Registro detalhado de refeições
- Controle de macronutrientes (proteína, carboidratos, gorduras)
- Contador de calorias
- Controle de hidratação
- Metas nutricionais personalizáveis

### 📈 Progresso
- Registro de peso e medidas corporais
- Histórico de evolução física
- Cálculo de % de gordura
- Acompanhamento de circunferências
- Espaço para observações

### ⚙️ Configurações
- Perfil personalizado
- Metas de treino e dieta
- Backup e exportação de dados
- Configurações de notificações (em desenvolvimento)

## 🎨 Design

- **Design System** baseado em shadcn/ui
- **Totalmente Responsivo** - funciona perfeitamente em desktop, tablet e mobile
- **Dark/Light Mode** ready (configuração em CSS variables)
- **Animações Suaves** com Tailwind CSS
- **UX Moderno** com feedback visual e micro-interações

## 💾 Armazenamento

- **Dados Locais** - Armazenamento seguro no localStorage do navegador
- **Persistência Automática** - Seus dados são salvos automaticamente
- **Backup/Restore** - Exporte seus dados para backup
- **Zero Dependências Externas** - Funciona offline

## 🏃‍♂️ Como Executar

### Desenvolvimento Local

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

### Deploy com Banco de Dados

Para hospedar com banco de dados na nuvem, siga o [Guia de Deploy](DEPLOY.md):

1. **Configurar Supabase** (banco de dados gratuito)
2. **Deploy no Vercel** (hospedagem gratuita)
3. **Configurar variáveis de ambiente**

**Resultado**: Site online com dados salvos na nuvem! 🚀

## 📱 Recursos Mobile

- **PWA Ready** - Pode ser instalado como app
- **Touch Friendly** - Interface otimizada para toque
- **Responsive Design** - Adapta-se a qualquer tela
- **Navegação Intuitiva** - Menu lateral colapsível

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Layout e navegação
│   └── ui/             # Componentes de interface
├── pages/              # Páginas da aplicação
├── store/              # Gerenciamento de estado (Zustand)
├── types/              # Tipos TypeScript
├── hooks/              # Custom hooks
├── data/               # Dados de exemplo
└── lib/                # Utilitários
```

## 🎯 Próximas Funcionalidades

- [ ] Notificações push
- [ ] Gráficos de progresso
- [ ] Compartilhamento de treinos
- [ ] Sincronização em nuvem
- [ ] Calculadora de macros
- [ ] Timer de treino
- [ ] Histórico de fotos de progresso

## 📄 Licença

Este projeto é de uso pessoal e educacional.

---

**Desenvolvido com ❤️ para quem busca uma vida mais saudável e ativa!**

## 🎮 Como Usar

1. **Primeiro Acesso:** O app carrega com dados de exemplo para você explorar
2. **Dashboard:** Veja um resumo do seu dia e semana
3. **Treinos:** Crie seus treinos personalizados com exercícios e séries
4. **Agenda:** Programe seus treinos no calendário
5. **Dieta:** Registre suas refeições e acompanhe macros
6. **Progresso:** Faça medições regulares para acompanhar evolução
7. **Configurações:** Personalize metas e faça backup dos dados

> **Dica:** Use a função de exportar dados nas configurações para fazer backup regular dos seus progressos!
