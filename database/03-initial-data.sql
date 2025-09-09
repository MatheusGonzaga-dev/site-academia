-- ================================
-- DADOS INICIAIS
-- ================================
-- Este script insere dados iniciais necessários

-- 1. PLANO SEMANAL PADRÃO (VAZIO)
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
) ON CONFLICT (id) DO NOTHING;

-- 2. DADOS DE EXEMPLO (OPCIONAL)
-- Você pode comentar esta seção se não quiser dados de exemplo

-- Entrada de dieta de exemplo
INSERT INTO diet_entries (
  id,
  user_id,
  date,
  meals,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo-user',
  '2025-09-08T00:00:00.000Z',
  '{
    "breakfast": [{"name": "Aveia com frutas", "calories": 350, "protein": 12, "carbs": 60, "fat": 8}],
    "lunch": [{"name": "Peito de frango grelhado", "calories": 400, "protein": 45, "carbs": 10, "fat": 15}],
    "dinner": [{"name": "Salmão com batata doce", "calories": 450, "protein": 35, "carbs": 35, "fat": 20}]
  }',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Entrada de progresso de exemplo
INSERT INTO progress_entries (
  id,
  user_id,
  date,
  weight,
  body_fat,
  muscle_mass,
  measurements,
  notes,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'demo-user',
  '2025-09-08T00:00:00.000Z',
  75.5,
  15.2,
  55.8,
  '{"chest": 100, "waist": 85, "arm": 35}',
  'Primeira medição do mês',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sucesso!
SELECT 'Initial data inserted successfully!' as status;

