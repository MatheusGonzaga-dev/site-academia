# 🏋️ Database Setup - Site Academia

## 📋 Instruções de Instalação

### 1. **Execute no Supabase SQL Editor**

Copie e cole o conteúdo do arquivo **`EXECUTE-THIS.sql`** no SQL Editor do Supabase e execute.

**Este script irá:**
- ✅ Limpar qualquer estrutura antiga
- ✅ Criar todas as tabelas necessárias
- ✅ Criar índices para performance
- ✅ Configurar triggers automáticos
- ✅ Inserir dados iniciais
- ✅ Verificar se tudo está funcionando

### 2. **Estrutura do Banco**

**Tabelas criadas:**
- `workouts` - Treinos dos usuários
- `diet_entries` - Entradas de dieta
- `progress_entries` - Registros de progresso
- `weekly_plans` - Planos semanais de treino

**Recursos incluídos:**
- ✅ UUIDs automáticos
- ✅ Timestamps automáticos
- ✅ Índices para performance
- ✅ Triggers para updated_at
- ✅ JSONB para dados flexíveis

### 3. **Fluxo do Sistema**

**Como funciona:**
1. **Usuário edita** plano semanal
2. **Sistema salva** no banco (tabela `weekly_plans`)
3. **Sistema gera treinos** automaticamente (tabela `workouts`)
4. **Interface atualiza** em tempo real
5. **Treinos aparecem** na página de treinos

### 4. **Verificação**

Após executar o script, você deve ver:
```
✅ PASSO 1: Limpeza concluída
✅ PASSO 2: Tabelas criadas  
✅ PASSO 3: Índices e triggers criados
✅ PASSO 4: Dados iniciais inseridos
🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!
```

### 5. **Teste o Sistema**

1. **Vá para "Plano Semanal"**
2. **Adicione treinos** em alguns dias
3. **Vá para "Treinos"**
4. **Treinos devem aparecer automaticamente**

## 🚀 Pronto para usar!

O sistema está configurado para funcionar sem duplicatas e com sincronização automática entre páginas.

