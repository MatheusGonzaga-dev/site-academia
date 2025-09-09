-- ================================
-- VERIFICAÇÃO DO SETUP
-- ================================
-- Este script verifica se tudo foi criado corretamente

-- 1. Verificar tabelas criadas
SELECT 'Tables created:' as check_type;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('workouts', 'diet_entries', 'progress_entries', 'weekly_plans')
ORDER BY table_name;

-- 2. Verificar colunas da tabela workouts
SELECT 'Workouts table structure:' as check_type;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'workouts' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar dados iniciais
SELECT 'Initial data count:' as check_type;
SELECT 
  'workouts' as table_name, COUNT(*) as count FROM workouts
UNION ALL
SELECT 
  'diet_entries' as table_name, COUNT(*) as count FROM diet_entries
UNION ALL
SELECT 
  'progress_entries' as table_name, COUNT(*) as count FROM progress_entries
UNION ALL
SELECT 
  'weekly_plans' as table_name, COUNT(*) as count FROM weekly_plans;

-- 4. Verificar plano semanal padrão
SELECT 'Weekly plan default:' as check_type;
SELECT id, name, active, schedule 
FROM weekly_plans 
WHERE user_id = 'demo-user' 
  AND active = true;

-- 5. Verificar índices
SELECT 'Indexes created:' as check_type;
SELECT indexname 
FROM pg_indexes 
WHERE tablename IN ('workouts', 'diet_entries', 'progress_entries', 'weekly_plans')
  AND schemaname = 'public'
ORDER BY indexname;

-- Sucesso!
SELECT 'Verification completed successfully!' as status;

