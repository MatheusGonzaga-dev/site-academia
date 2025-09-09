-- ================================
-- SETUP INICIAL DO BANCO DE DADOS
-- ================================
-- Este script cria toda a estrutura do banco do zero
-- Execute este script no Supabase SQL Editor

-- 1. Primeiro, remover todas as tabelas existentes (se houver)
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS diet_entries CASCADE;
DROP TABLE IF EXISTS progress_entries CASCADE;
DROP TABLE IF EXISTS weekly_plans CASCADE;

-- 2. Remover triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Sucesso!
SELECT 'Database reset completed successfully!' as status;
