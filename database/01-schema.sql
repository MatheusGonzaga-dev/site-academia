-- ================================
-- SCHEMA PRINCIPAL DO BANCO
-- ================================
-- Este script cria todas as tabelas principais

-- 1. TABELA DE TREINOS
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN NOT NULL DEFAULT false,
  duration INTEGER, -- duração em minutos
  notes TEXT,
  from_weekly_plan BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE DIETA
CREATE TABLE diet_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE PROGRESSO
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

-- 4. TABELA DE PLANOS SEMANAIS
CREATE TABLE weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  schedule JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sucesso!
SELECT 'Schema created successfully!' as status;

