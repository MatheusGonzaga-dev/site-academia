-- Script para corrigir RLS da tabela sessoes_treino
-- Permite que usuários autenticados insiram e vejam seus próprios treinos

-- 1. Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'sessoes_treino';

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can insert own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can update own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can delete own sessoes_treino" ON sessoes_treino;

-- 3. Criar políticas RLS corretas
CREATE POLICY "Users can view own sessoes_treino" ON sessoes_treino
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert own sessoes_treino" ON sessoes_treino
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update own sessoes_treino" ON sessoes_treino
    FOR UPDATE USING (auth.uid() = usuario_id)
    WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can delete own sessoes_treino" ON sessoes_treino
    FOR DELETE USING (auth.uid() = usuario_id);

-- 4. Verificar se RLS está habilitado
ALTER TABLE sessoes_treino ENABLE ROW LEVEL SECURITY;

-- 5. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'sessoes_treino';

-- 6. Testar inserção (substitua pelo seu user_id)
-- INSERT INTO sessoes_treino (usuario_id, nome, descricao, dia_treino_id, duracao_minutos, ativo)
-- VALUES (auth.uid(), 'Teste RLS', 'Teste', '56cba088-b4f3-4166-b9fd-eea6cf6ea5f8', 60, true);


