-- Script simples para corrigir RLS da tabela sessoes_treino

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can insert own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can update own sessoes_treino" ON sessoes_treino;
DROP POLICY IF EXISTS "Users can delete own sessoes_treino" ON sessoes_treino;

-- Criar políticas básicas
CREATE POLICY "Enable all for authenticated users" ON sessoes_treino
    FOR ALL USING (auth.uid() = usuario_id);

-- Garantir que RLS está habilitado
ALTER TABLE sessoes_treino ENABLE ROW LEVEL SECURITY;


