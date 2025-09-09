-- ================================
-- SCRIPT PRINCIPAL DE INSTALAÇÃO
-- ================================
-- EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR
-- 
-- Este script irá:
-- 1. Limpar o banco de dados
-- 2. Criar todas as tabelas
-- 3. Criar índices e triggers
-- 4. Inserir dados iniciais
-- 5. Verificar se tudo está funcionando
-- ================================

-- PASSO 1: LIMPEZA INICIAL
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS diet_entries CASCADE;
DROP TABLE IF EXISTS progress_entries CASCADE;
DROP TABLE IF EXISTS weekly_plans CASCADE;

-- Remover triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

SELECT '✅ PASSO 1: Limpeza concluída' as status;

-- PASSO 2: CRIAR SCHEMA
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN NOT NULL DEFAULT false,
  duration INTEGER,
  notes TEXT,
  from_weekly_plan BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE diet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  weight DECIMAL(5,2),
  body_fat DECIMAL(5,2),
  muscle_mass DECIMAL(5,2),
  measurements JSONB DEFAULT '{}',
  photos TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

SELECT '✅ PASSO 2: Tabelas criadas' as status;

-- PASSO 3: CRIAR ÍNDICES E TRIGGERS
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);
CREATE INDEX idx_workouts_from_weekly_plan ON workouts(from_weekly_plan);
CREATE INDEX idx_diet_entries_user_date ON diet_entries(user_id, date);
CREATE INDEX idx_progress_entries_user_date ON progress_entries(user_id, date);
CREATE INDEX idx_weekly_plans_user_active ON weekly_plans(user_id, active);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_workouts
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_diet_entries
    BEFORE UPDATE ON diet_entries
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_progress_entries
    BEFORE UPDATE ON progress_entries
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_weekly_plans
    BEFORE UPDATE ON weekly_plans
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

SELECT '✅ PASSO 3: Índices e triggers criados' as status;

-- PASSO 4: INSERIR DADOS INICIAIS
INSERT INTO weekly_plans (
  id,
  user_id,
  name,
  schedule,
  active,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo-user',
  'Meu Plano Semanal',
  '{}',
  true,
  NOW(),
  NOW()
);

SELECT '✅ PASSO 4: Dados iniciais inseridos' as status;

-- PASSO 5: VERIFICAÇÃO FINAL
SELECT '✅ VERIFICAÇÃO FINAL:' as status;
SELECT 
  'workouts: ' || COUNT(*) as count FROM workouts
UNION ALL
SELECT 
  'diet_entries: ' || COUNT(*) as count FROM diet_entries
UNION ALL
SELECT 
  'progress_entries: ' || COUNT(*) as count FROM progress_entries
UNION ALL
SELECT 
  'weekly_plans: ' || COUNT(*) as count FROM weekly_plans;

-- SUCESSO TOTAL!
SELECT '🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!' as final_status;
SELECT 'Banco de dados pronto para uso!' as message;
