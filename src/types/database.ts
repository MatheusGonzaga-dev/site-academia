// Tipos do banco de dados
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nome: string
          avatar_url: string | null
          data_nascimento: string | null
          altura: number | null
          peso: number | null
          genero: 'masculino' | 'feminino' | 'outro' | null
          nivel_atividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo' | null
          objetivo: 'perda_peso' | 'ganho_massa' | 'manutencao' | 'resistencia' | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          email: string
          nome: string
          avatar_url?: string | null
          data_nascimento?: string | null
          altura?: number | null
          peso?: number | null
          genero?: 'masculino' | 'feminino' | 'outro' | null
          nivel_atividade?: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo' | null
          objetivo?: 'perda_peso' | 'ganho_massa' | 'manutencao' | 'resistencia' | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          email?: string
          nome?: string
          avatar_url?: string | null
          data_nascimento?: string | null
          altura?: number | null
          peso?: number | null
          genero?: 'masculino' | 'feminino' | 'outro' | null
          nivel_atividade?: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo' | null
          objetivo?: 'perda_peso' | 'ganho_massa' | 'manutencao' | 'resistencia' | null
          criado_em?: string
          atualizado_em?: string
        }
      }
      musculos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          imagem_url: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          imagem_url?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          imagem_url?: string | null
          criado_em?: string
        }
      }
      exercicios: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          instrucoes: string | null
          musculo_id: string
          equipamento: string | null
          nivel_dificuldade: 'iniciante' | 'intermediario' | 'avancado' | null
          video_url: string | null
          imagem_url: string | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          instrucoes?: string | null
          musculo_id: string
          equipamento?: string | null
          nivel_dificuldade?: 'iniciante' | 'intermediario' | 'avancado' | null
          video_url?: string | null
          imagem_url?: string | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          instrucoes?: string | null
          musculo_id?: string
          equipamento?: string | null
          nivel_dificuldade?: 'iniciante' | 'intermediario' | 'avancado' | null
          video_url?: string | null
          imagem_url?: string | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      dias_treino: {
        Row: {
          id: string
          nome: string
          ordem_dia: number
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          ordem_dia: number
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          ordem_dia?: number
          criado_em?: string
        }
      }
      sessoes_treino: {
        Row: {
          id: string
          usuario_id: string
          treinador_id: string | null
          nome: string
          descricao: string | null
          dia_treino_id: string
          duracao_minutos: number | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          usuario_id: string
          treinador_id?: string | null
          nome: string
          descricao?: string | null
          dia_treino_id: string
          duracao_minutos?: number | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          treinador_id?: string | null
          nome?: string
          descricao?: string | null
          dia_treino_id?: string
          duracao_minutos?: number | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      exercicios_sessao: {
        Row: {
          id: string
          sessao_treino_id: string
          exercicio_id: string
          ordem_exercicio: number
          series: number
          repeticoes: number | null
          peso_kg: number | null
          duracao_segundos: number | null
          descanso_segundos: number
          observacoes: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          sessao_treino_id: string
          exercicio_id: string
          ordem_exercicio: number
          series?: number
          repeticoes?: number | null
          peso_kg?: number | null
          duracao_segundos?: number | null
          descanso_segundos?: number
          observacoes?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          sessao_treino_id?: string
          exercicio_id?: string
          ordem_exercicio?: number
          series?: number
          repeticoes?: number | null
          peso_kg?: number | null
          duracao_segundos?: number | null
          descanso_segundos?: number
          observacoes?: string | null
          criado_em?: string
        }
      }
      tipos_alimento: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          cor: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          cor?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          cor?: string | null
          criado_em?: string
        }
      }
      produtos: {
        Row: {
          id: string
          nome: string
          marca: string | null
          tipo_alimento_id: string
          calorias_por_100g: number
          proteina_por_100g: number
          carboidratos_por_100g: number
          gorduras_por_100g: number
          fibras_por_100g: number
          acucares_por_100g: number
          sodio_por_100g: number
          tamanho_porcao_g: number
          codigo_barras: string | null
          imagem_url: string | null
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          nome: string
          marca?: string | null
          tipo_alimento_id: string
          calorias_por_100g: number
          proteina_por_100g?: number
          carboidratos_por_100g?: number
          gorduras_por_100g?: number
          fibras_por_100g?: number
          acucares_por_100g?: number
          sodio_por_100g?: number
          tamanho_porcao_g?: number
          codigo_barras?: string | null
          imagem_url?: string | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          marca?: string | null
          tipo_alimento_id?: string
          calorias_por_100g?: number
          proteina_por_100g?: number
          carboidratos_por_100g?: number
          gorduras_por_100g?: number
          fibras_por_100g?: number
          acucares_por_100g?: number
          sodio_por_100g?: number
          tamanho_porcao_g?: number
          codigo_barras?: string | null
          imagem_url?: string | null
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      refeicoes: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          ordem_refeicao: number
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          ordem_refeicao: number
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          ordem_refeicao?: number
          criado_em?: string
        }
      }
      historico_treinos: {
        Row: {
          id: string
          usuario_id: string
          sessao_treino_id: string
          exercicio_id: string
          serie_atual: number
          series_concluidas: number[]
          data_execucao: string
          semana_ano: string
          concluido: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          usuario_id: string
          sessao_treino_id: string
          exercicio_id: string
          serie_atual?: number
          series_concluidas?: number[]
          data_execucao: string
          semana_ano: string
          concluido?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          sessao_treino_id?: string
          exercicio_id?: string
          serie_atual?: number
          series_concluidas?: number[]
          data_execucao?: string
          semana_ano?: string
          concluido?: boolean
          criado_em?: string
          atualizado_em?: string
        }
      }
      [key: string]: any
    }
  }
}


