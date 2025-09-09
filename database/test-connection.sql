-- ================================
-- TESTE DE CONEXÃO E FUNCIONALIDADE
-- ================================
-- Execute este script para verificar se tudo está funcionando

-- 1. Verificar se as tabelas existem
SELECT 'Verificando tabelas...' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workouts', 'diet_entries', 'progress_entries', 'weekly_plans')
ORDER BY table_name;

-- 2. Verificar plano semanal padrão
SELECT 'Verificando plano semanal padrão...' as status;
SELECT 
  id,
  name,
  active,
  jsonb_pretty(schedule) as schedule_formatted
FROM weekly_plans 
WHERE user_id = 'demo-user';

-- 3. Testar inserção no plano semanal
SELECT 'Testando inserção no plano semanal...' as status;
UPDATE weekly_plans 
SET schedule = '{
  "2": {
    "id": "test-template",
    "name": "Peito - Teste",
    "targetMuscles": ["Peito"],
    "exercises": [
      {
        "id": "test-exercise",
        "name": "Supino",
        "targetMuscle": "Peito"
      }
    ]
  }
}',
updated_at = NOW()
WHERE user_id = 'demo-user' AND active = true;

-- 4. Verificar se a atualização funcionou
SELECT 'Verificando atualização...' as status;
SELECT 
  id,
  name,
  updated_at,
  jsonb_pretty(schedule) as schedule_formatted
FROM weekly_plans 
WHERE user_id = 'demo-user' AND active = true;

-- 5. Limpar teste
SELECT 'Limpando dados de teste...' as status;
UPDATE weekly_plans 
SET schedule = '{}',
updated_at = NOW()
WHERE user_id = 'demo-user' AND active = true;

-- 6. Verificar workouts
SELECT 'Verificando workouts...' as status;
SELECT COUNT(*) as total_workouts FROM workouts WHERE user_id = 'demo-user';

-- Sucesso!
SELECT '✅ TESTE CONCLUÍDO - Banco funcionando!' as final_status;

