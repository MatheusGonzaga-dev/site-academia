-- Script para corrigir o trigger de criação de usuários definitivamente

-- 1. Remover trigger e função existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Verificar e remover política conflitante
DROP POLICY IF EXISTS "Usuarios podem ver próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios podem atualizar próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção via trigger" ON usuarios;

-- 3. Temporariamente desabilitar RLS para testes
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- 4. Criar função otimizada para inserir usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Tentar inserir o usuário na tabela usuarios
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
    nome = COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name', 
      split_part(NEW.email, '@', 1)
    ),
    atualizado_em = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Reabilitar RLS com políticas corrigidas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas funcionais
CREATE POLICY "Usuarios podem ver próprio perfil" ON usuarios 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios podem atualizar próprio perfil" ON usuarios 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Sistema pode inserir usuários" ON usuarios 
  FOR INSERT WITH CHECK (true);

-- 8. Verificar se existem usuários órfãos e corrigi-los
INSERT INTO public.usuarios (id, email, nome, criado_em, atualizado_em)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name', 
    split_part(au.email, '@', 1)
  ),
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.usuarios u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 9. Verificar resultado
SELECT 
  'auth.users' as tabela,
  count(*) as total
FROM auth.users
UNION ALL
SELECT 
  'usuarios' as tabela,
  count(*) as total
FROM public.usuarios;
