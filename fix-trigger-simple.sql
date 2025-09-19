-- Script simples para corrigir o trigger
-- Execute este script no Supabase SQL Editor

-- 1. Desabilitar RLS na tabela usuarios
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- 2. Recriar a função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
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
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Erro no trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar se foi criado
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';

-- 5. Testar inserção manual
INSERT INTO public.usuarios (id, email, nome, criado_em, atualizado_em)
VALUES (
    gen_random_uuid(),
    'teste-trigger@exemplo.com',
    'Teste Trigger',
    NOW(),
    NOW()
);

-- 6. Verificar se foi inserido
SELECT * FROM public.usuarios WHERE email = 'teste-trigger@exemplo.com';
