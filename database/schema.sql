-- Schema do banco de dados para Minha Academia
-- Execute este SQL no SQL Editor do Supabase

-- Nota: A tabela auth.users já existe e tem RLS habilitado por padrão

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  exercises JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de entradas de dieta
CREATE TABLE IF NOT EXISTS diet_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  meals JSONB DEFAULT '{"breakfast": [], "lunch": [], "dinner": [], "snacks": []}'::jsonb,
  water_intake INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de entradas de progresso
CREATE TABLE IF NOT EXISTS progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL,
  weight DECIMAL(5,2),
  body_fat DECIMAL(4,2),
  measurements JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas de segurança (RLS)
-- Workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Diet entries
ALTER TABLE diet_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diet entries" ON diet_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet entries" ON diet_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diet entries" ON diet_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own diet entries" ON diet_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Progress entries
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress entries" ON progress_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress entries" ON progress_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress entries" ON progress_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress entries" ON progress_entries
  FOR DELETE USING (auth.uid() = user_id);

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
