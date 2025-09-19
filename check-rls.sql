-- Verificar e corrigir RLS (Row Level Security)
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se RLS está habilitado na tabela usuarios
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE tablename = 'usuarios' 
AND schemaname = 'public';

-- 2. Verificar políticas RLS existentes
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
WHERE tablename = 'usuarios' 
AND schemaname = 'public';

-- 3. Desabilitar RLS temporariamente para teste
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- 4. Verificar se foi desabilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE tablename = 'usuarios' 
AND schemaname = 'public';

-- 5. Testar inserção manual
INSERT INTO public.usuarios (id, email, nome, criado_em, atualizado_em)
VALUES (
    gen_random_uuid(),
    'teste-rls@exemplo.com',
    'Teste RLS',
    NOW(),
    NOW()
);

-- 6. Verificar se foi inserido
SELECT * FROM public.usuarios WHERE email = 'teste-rls@exemplo.com';

-- 7. Reabilitar RLS (opcional)
-- ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
