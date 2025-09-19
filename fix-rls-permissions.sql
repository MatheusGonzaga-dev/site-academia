-- Script para corrigir políticas RLS e permitir acesso aos dados do usuário

-- 1. Verificar usuários logados vs usuários na tabela
SELECT 
  'Total usuários em auth.users' as info,
  count(*) as quantidade
FROM auth.users
UNION ALL
SELECT 
  'Total usuários em usuarios' as info,
  count(*) as quantidade  
FROM public.usuarios;

-- 2. Remover todas as políticas existentes para recriar
DROP POLICY IF EXISTS "Usuarios podem ver próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios podem atualizar próprio perfil" ON usuarios;
DROP POLICY IF EXISTS "Sistema pode inserir usuários" ON usuarios;
DROP POLICY IF EXISTS "Permitir inserção via trigger" ON usuarios;

-- 3. Criar políticas mais permissivas para debug
CREATE POLICY "Usuarios autenticados podem ver próprios dados" ON usuarios
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Usuarios autenticados podem atualizar próprios dados" ON usuarios
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Sistema pode criar usuarios" ON usuarios
  FOR INSERT 
  WITH CHECK (true);

-- 4. Verificar se as políticas foram criadas
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'usuarios';

-- 5. Testar acesso direto (execute como usuário logado)
-- Esta query deve retornar o usuário logado
SELECT 
  id,
  email,
  nome,
  criado_em
FROM usuarios 
WHERE auth.uid() = id;

-- 6. Para debug: Verificar se auth.uid() está funcionando
SELECT 
  auth.uid() as user_id_from_auth,
  auth.email() as email_from_auth;

-- 7. Verificar se o JWT está sendo processado corretamente
SELECT 
  current_setting('request.jwt.claims', true)::json as jwt_claims;
