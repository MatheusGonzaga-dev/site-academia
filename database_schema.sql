-- =============================================
-- SCHEMA PARA SISTEMA DE TREINO E DIETA
-- =============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELAS DE USUÁRIOS E AUTENTICAÇÃO
-- =============================================

-- Tabela de usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    data_nascimento DATE,
    altura DECIMAL(5,2), -- em cm
    peso DECIMAL(5,2), -- em kg
    genero VARCHAR(10) CHECK (genero IN ('masculino', 'feminino', 'outro')),
    nivel_atividade VARCHAR(20) CHECK (nivel_atividade IN ('sedentario', 'leve', 'moderado', 'ativo', 'muito_ativo')),
    objetivo VARCHAR(20) CHECK (objetivo IN ('perda_peso', 'ganho_massa', 'manutencao', 'resistencia')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de treinadores
CREATE TABLE treinadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    especializacao VARCHAR(255),
    anos_experiencia INTEGER,
    certificacoes TEXT[],
    biografia TEXT,
    valor_hora DECIMAL(10,2),
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE TREINO
-- =============================================

-- Tabela de músculos/grupos musculares
CREATE TABLE musculos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    imagem_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios
CREATE TABLE exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    instrucoes TEXT,
    musculo_id UUID REFERENCES musculos(id) ON DELETE CASCADE,
    equipamento VARCHAR(100),
    nivel_dificuldade VARCHAR(20) CHECK (nivel_dificuldade IN ('iniciante', 'intermediario', 'avancado')),
    video_url TEXT,
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dias da semana para treinos
CREATE TABLE dias_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(20) NOT NULL UNIQUE,
    ordem_dia INTEGER NOT NULL UNIQUE, -- 1=Segunda, 2=Terça, etc.
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de treino
CREATE TABLE sessoes_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    treinador_id UUID REFERENCES treinadores(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    dia_treino_id UUID REFERENCES dias_treino(id) ON DELETE CASCADE,
    duracao_minutos INTEGER,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de exercícios dentro de uma sessão
CREATE TABLE exercicios_sessao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessao_treino_id UUID REFERENCES sessoes_treino(id) ON DELETE CASCADE,
    exercicio_id UUID REFERENCES exercicios(id) ON DELETE CASCADE,
    ordem_exercicio INTEGER NOT NULL,
    series INTEGER NOT NULL DEFAULT 1,
    repeticoes INTEGER,
    peso_kg DECIMAL(6,2),
    duracao_segundos INTEGER, -- para exercícios de tempo
    descanso_segundos INTEGER DEFAULT 60,
    observacoes TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE DIETA
-- =============================================

-- Tabela de tipos de alimento
CREATE TABLE tipos_alimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(7), -- código hex para cor
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos alimentícios
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    marca VARCHAR(255),
    tipo_alimento_id UUID REFERENCES tipos_alimento(id) ON DELETE CASCADE,
    calorias_por_100g DECIMAL(8,2) NOT NULL,
    proteina_por_100g DECIMAL(8,2) DEFAULT 0,
    carboidratos_por_100g DECIMAL(8,2) DEFAULT 0,
    gorduras_por_100g DECIMAL(8,2) DEFAULT 0,
    fibras_por_100g DECIMAL(8,2) DEFAULT 0,
    acucares_por_100g DECIMAL(8,2) DEFAULT 0,
    sodio_por_100g DECIMAL(8,2) DEFAULT 0,
    tamanho_porcao_g DECIMAL(8,2) DEFAULT 100,
    codigo_barras VARCHAR(50),
    imagem_url TEXT,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de refeições
CREATE TABLE refeicoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ordem_refeicao INTEGER NOT NULL, -- ordem do dia (1=café da manhã, 2=lanche, etc.)
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos dentro de uma refeição
CREATE TABLE produtos_refeicao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refeicao_id UUID REFERENCES refeicoes(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade_g DECIMAL(8,2) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELAS DE PLANOS E HISTÓRICO
-- =============================================

-- Tabela de planos de treino do usuário
CREATE TABLE planos_treino (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos de dieta do usuário
CREATE TABLE planos_dieta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    calorias_diarias INTEGER,
    proteina_diaria DECIMAL(8,2),
    carboidratos_diarios DECIMAL(8,2),
    gorduras_diarias DECIMAL(8,2),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de treinos realizados
CREATE TABLE historico_treinos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    sessao_treino_id UUID REFERENCES sessoes_treino(id) ON DELETE CASCADE,
    concluido_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duracao_minutos INTEGER,
    observacoes TEXT,
    avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5)
);

-- Tabela de histórico de exercícios realizados
CREATE TABLE historico_exercicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    historico_treino_id UUID REFERENCES historico_treinos(id) ON DELETE CASCADE,
    exercicio_id UUID REFERENCES exercicios(id) ON DELETE CASCADE,
    series_concluidas INTEGER NOT NULL,
    repeticoes_concluidas INTEGER,
    peso_kg DECIMAL(6,2),
    duracao_segundos INTEGER,
    descanso_segundos INTEGER,
    observacoes TEXT
);

-- Tabela de histórico de refeições consumidas
CREATE TABLE historico_refeicoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    refeicao_id UUID REFERENCES refeicoes(id) ON DELETE CASCADE,
    consumido_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observacoes TEXT
);

-- Tabela de produtos consumidos
CREATE TABLE produtos_consumidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    historico_refeicao_id UUID REFERENCES historico_refeicoes(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
    quantidade_g DECIMAL(8,2) NOT NULL
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================

-- Índices para consultas frequentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_exercicios_musculo_id ON exercicios(musculo_id);
CREATE INDEX idx_sessoes_treino_usuario_id ON sessoes_treino(usuario_id);
CREATE INDEX idx_sessoes_treino_dia_id ON sessoes_treino(dia_treino_id);
CREATE INDEX idx_produtos_tipo_alimento_id ON produtos(tipo_alimento_id);
CREATE INDEX idx_historico_treinos_usuario_id ON historico_treinos(usuario_id);
CREATE INDEX idx_historico_treinos_data ON historico_treinos(concluido_em);
CREATE INDEX idx_historico_refeicoes_usuario_id ON historico_refeicoes(usuario_id);
CREATE INDEX idx_historico_refeicoes_data ON historico_refeicoes(consumido_em);

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir dias da semana
INSERT INTO dias_treino (nome, ordem_dia) VALUES
('Segunda-feira', 1),
('Terça-feira', 2),
('Quarta-feira', 3),
('Quinta-feira', 4),
('Sexta-feira', 5),
('Sábado', 6),
('Domingo', 7);

-- Inserir grupos musculares
INSERT INTO musculos (nome, descricao) VALUES
('Peito', 'Músculos do tórax'),
('Costas', 'Músculos das costas'),
('Ombros', 'Músculos dos ombros'),
('Braços', 'Bíceps e tríceps'),
('Pernas', 'Quadríceps, posterior e panturrilhas'),
('Core', 'Abdominais e músculos do core'),
('Glúteos', 'Músculos dos glúteos'),
('Cardio', 'Exercícios cardiovasculares');

-- Inserir tipos de alimento
INSERT INTO tipos_alimento (nome, descricao, cor) VALUES
('Proteína', 'Alimentos ricos em proteína', '#FF6B6B'),
('Carboidrato', 'Alimentos ricos em carboidratos', '#4ECDC4'),
('Gordura', 'Alimentos ricos em gorduras saudáveis', '#45B7D1'),
('Vegetal', 'Vegetais e verduras', '#96CEB4'),
('Fruta', 'Frutas', '#FFEAA7'),
('Laticínio', 'Produtos lácteos', '#DDA0DD'),
('Cereal', 'Cereais e grãos', '#F4A460'),
('Bebida', 'Bebidas', '#87CEEB');

-- Inserir refeições do dia
INSERT INTO refeicoes (nome, descricao, ordem_refeicao) VALUES
('Café da manhã', 'Primeira refeição do dia', 1),
('Lanche da manhã', 'Lanche entre café e almoço', 2),
('Almoço', 'Refeição principal do meio-dia', 3),
('Lanche da tarde', 'Lanche entre almoço e jantar', 4),
('Jantar', 'Refeição principal da noite', 5),
('Ceia', 'Última refeição do dia', 6);

-- =============================================
-- TRIGGERS PARA UPDATED_AT
-- =============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para tabelas que precisam de updated_at
CREATE TRIGGER update_usuarios_atualizado_em BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treinadores_atualizado_em BEFORE UPDATE ON treinadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercicios_atualizado_em BEFORE UPDATE ON exercicios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessoes_treino_atualizado_em BEFORE UPDATE ON sessoes_treino FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_atualizado_em BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_treino_atualizado_em BEFORE UPDATE ON planos_treino FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planos_dieta_atualizado_em BEFORE UPDATE ON planos_dieta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS (ROW LEVEL SECURITY) - SEGURANÇA
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE treinadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercicios_sessao ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_treino ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_dieta ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_treinos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_exercicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_refeicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_consumidos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usuários só podem ver/editar seus próprios dados)
CREATE POLICY "Usuarios podem ver próprio perfil" ON usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios podem atualizar próprio perfil" ON usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios podem ver próprias sessões de treino" ON sessoes_treino FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuarios podem gerenciar próprias sessões de treino" ON sessoes_treino FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem ver próprios exercícios de sessão" ON exercicios_sessao FOR SELECT USING (
    EXISTS (SELECT 1 FROM sessoes_treino WHERE id = exercicios_sessao.sessao_treino_id AND usuario_id = auth.uid())
);
CREATE POLICY "Usuarios podem gerenciar próprios exercícios de sessão" ON exercicios_sessao FOR ALL USING (
    EXISTS (SELECT 1 FROM sessoes_treino WHERE id = exercicios_sessao.sessao_treino_id AND usuario_id = auth.uid())
);

-- Políticas para tabelas de referência (todos podem ler)
CREATE POLICY "Qualquer um pode ver músculos" ON musculos FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver exercícios" ON exercicios FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver dias de treino" ON dias_treino FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver tipos de alimento" ON tipos_alimento FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver produtos" ON produtos FOR SELECT USING (true);
CREATE POLICY "Qualquer um pode ver refeições" ON refeicoes FOR SELECT USING (true);
