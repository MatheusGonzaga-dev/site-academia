-- Script para debugar e corrigir problemas com o trigger de usuário

-- 1. Verificar se o trigger existe
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_name LIKE '%auth_user%';

-- 2. Verificar se a função existe
SELECT 
    routine_name, 
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%handle_new_user%';

-- 3. Verificar se a tabela usuarios tem as colunas necessárias
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- 4. Verificar se há usuários na tabela auth.users mas não na usuarios
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created_at,
    u.id as user_id,
    u.email as user_email,
    u.criado_em as user_created_at
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL;

-- 5. Script para corrigir e recriar o trigger (execute se necessário)
-- Dropar trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recriar função melhorada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log para debug
  RAISE LOG 'Trigger executado para usuário: % com email: %', NEW.id, NEW.email;
  
  INSERT INTO public.usuarios (
    id,
    email,
    nome,
    criado_em,
    atualizado_em
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name', 
      split_part(NEW.email, '@', 1)
    ),
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    atualizado_em = NOW();
    
  RAISE LOG 'Usuário inserido/atualizado na tabela usuarios: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Erro no trigger handle_new_user: %', SQLERRM;
    RETURN NEW; -- Não falhar o cadastro mesmo se houver erro
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar se a política de RLS permite inserção
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'usuarios';

-- 7. Adicionar política para permitir que o trigger insira dados
DROP POLICY IF EXISTS "Permitir inserção via trigger" ON usuarios;
CREATE POLICY "Permitir inserção via trigger" ON usuarios
  FOR INSERT 
  WITH CHECK (true);

-- 8. Dar permissões necessárias para a função
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON public.usuarios TO authenticated, anon;
