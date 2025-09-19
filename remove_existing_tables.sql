-- =============================================
-- SCRIPT PARA REMOVER TODAS AS TABELAS EXISTENTES
-- =============================================

-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- Este script remove todas as tabelas existentes para permitir a criação do novo schema

-- =============================================
-- REMOVER TABELAS COM DEPENDÊNCIAS (em ordem)
-- =============================================

-- Remover tabelas de histórico e logs primeiro
DROP TABLE IF EXISTS produtos_consumidos CASCADE;
DROP TABLE IF EXISTS historico_refeicoes CASCADE;
DROP TABLE IF EXISTS historico_exercicios CASCADE;
DROP TABLE IF EXISTS historico_treinos CASCADE;

-- Remover tabelas de planos
DROP TABLE IF EXISTS planos_dieta CASCADE;
DROP TABLE IF EXISTS planos_treino CASCADE;

-- Remover tabelas de relacionamento
DROP TABLE IF EXISTS produtos_refeicao CASCADE;
DROP TABLE IF EXISTS exercicios_sessao CASCADE;

-- Remover tabelas principais
DROP TABLE IF EXISTS sessoes_treino CASCADE;
DROP TABLE IF EXISTS refeicoes CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS exercicios CASCADE;

-- Remover tabelas de referência
DROP TABLE IF EXISTS dias_treino CASCADE;
DROP TABLE IF EXISTS tipos_alimento CASCADE;
DROP TABLE IF EXISTS musculos CASCADE;

-- Remover tabelas de usuários
DROP TABLE IF EXISTS treinadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =============================================
-- REMOVER TABELAS EXISTENTES (em inglês)
-- =============================================

-- Remover tabelas que podem existir com nomes em inglês
DROP TABLE IF EXISTS body_measurements CASCADE;
DROP TABLE IF EXISTS diet_entries CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS progress_entries CASCADE;
DROP TABLE IF EXISTS progress_photos CASCADE;
DROP TABLE IF EXISTS sets CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS weekly_plan_days CASCADE;
DROP TABLE IF EXISTS weekly_plans CASCADE;
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS workout_templates CASCADE;
DROP TABLE IF EXISTS workout_template_exercises CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;

-- =============================================
-- REMOVER FUNÇÕES E TRIGGERS
-- =============================================

-- Remover função de trigger se existir
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =============================================
-- REMOVER EXTENSÕES (opcional - mantenha se usar em outros lugares)
-- =============================================

-- Descomente a linha abaixo se quiser remover a extensão uuid-ossp
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- =============================================
-- VERIFICAR TABELAS RESTANTES
-- =============================================

-- Query para verificar se ainda existem tabelas no schema public
-- Execute este comando após rodar o script para verificar
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =============================================
-- INSTRUÇÕES
-- =============================================

/*
INSTRUÇÕES DE USO:

1. Abra o Supabase Dashboard
2. Vá para SQL Editor
3. Cole este script completo
4. Execute o script
5. Verifique se todas as tabelas foram removidas executando a query de verificação
6. Após confirmar que as tabelas foram removidas, execute o database_schema.sql

IMPORTANTE: 
- Este script remove TODAS as tabelas existentes
- Faça backup dos dados importantes antes de executar
- O CASCADE garante que as dependências sejam removidas automaticamente
*/
