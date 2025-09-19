# 🚀 Quick Start - Academia Fitness

## ⚡ Início Rápido (2 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Ambiente
```bash
npm run setup
```

### 3. Executar Projeto
```bash
npm run dev
```

### 4. Acessar Aplicação
Abra: [http://localhost:3000](http://localhost:3000)

## 🗄️ Configurar Banco de Dados

1. **Acesse seu Supabase**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Vá para SQL Editor**
3. **Execute os scripts na ordem:**

```sql
-- 1. Remover tabelas existentes (se houver)
-- Cole o conteúdo de: remove_existing_tables.sql

-- 2. Criar schema completo
-- Cole o conteúdo de: database_schema.sql

-- 3. Configurar triggers de usuário
-- Cole o conteúdo de: create_user_trigger.sql
```

## ✅ Pronto!

Sua aplicação está funcionando! 

**Recursos disponíveis:**
- 🏠 Landing page responsiva
- 🔐 Sistema de autenticação
- 💪 Gestão de treinos
- 🍎 Controle de dieta
- 📱 PWA (instalável no celular)

## 🆘 Problemas?

**Erro de variáveis de ambiente:**
```bash
npm run setup
```

**Erro de build:**
```bash
rm -rf .next
npm run build
```

**Problemas com Supabase:**
- Verifique se o projeto está ativo
- Confirme se as tabelas foram criadas
- Teste a conexão no dashboard

---

**Precisa de ajuda?** Consulte o [INSTALACAO.md](INSTALACAO.md) para instruções detalhadas.
