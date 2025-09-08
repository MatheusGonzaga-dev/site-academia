-- Schema sem autenticação para Minha Academia
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de treinos (sem RLS)
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  exercises JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de entradas de dieta (sem RLS)
CREATE TABLE IF NOT EXISTS diet_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  meals JSONB DEFAULT '{"breakfast": [], "lunch": [], "dinner": [], "snacks": []}'::jsonb,
  water_intake INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de entradas de progresso (sem RLS)
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  date TIMESTAMPTZ NOT NULL,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  measurements JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diet_entries_updated_at BEFORE UPDATE ON diet_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_entries_updated_at BEFORE UPDATE ON progress_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
CREATE INDEX IF NOT EXISTS idx_diet_entries_user_id ON diet_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_entries_date ON diet_entries(date);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON progress_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_date ON progress_entries(date);
