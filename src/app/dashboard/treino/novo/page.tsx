'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Dumbbell,
  Clock,
  Target,
  Calendar,
  Search,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase-client'

interface Exercise {
  id: string
  nome: string
  musculo: string
  equipamento: string
  series: number
  repeticoes: number
  peso: number
  descanso: number
}

interface WorkoutForm {
  nome: string
  descricao: string
  dia_treino_id: string
  duracao_minutos: number
  exercicios: Exercise[]
}


interface ExerciseFromDB {
  id: string
  nome: string
  musculo_id: string
  equipamento?: string
  musculos: {
    nome: string
  }
}

export default function NovoWorkoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [form, setForm] = useState<WorkoutForm>({
    nome: '',
    descricao: '',
    dia_treino_id: '',
    duracao_minutos: 60,
    exercicios: []
  })
  const [searchExercise, setSearchExercise] = useState('')
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState<ExerciseFromDB[]>([])
  const [loadingExercises, setLoadingExercises] = useState(false)
  const [diasSemana, setDiasSemana] = useState<any[]>([])
  // supabase já está importado

  const loadDiasSemana = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('dias_treino')
        .select('id, nome, ordem_dia')
        .order('ordem_dia')

      if (error) {
        console.error('Erro ao carregar dias:', error)
        // Usar dias padrão se der erro
        setDiasSemana([
          { id: '1', nome: 'Segunda-feira', ordem_dia: 1 },
          { id: '2', nome: 'Terça-feira', ordem_dia: 2 },
          { id: '3', nome: 'Quarta-feira', ordem_dia: 3 },
          { id: '4', nome: 'Quinta-feira', ordem_dia: 4 },
          { id: '5', nome: 'Sexta-feira', ordem_dia: 5 },
          { id: '6', nome: 'Sábado', ordem_dia: 6 },
          { id: '7', nome: 'Domingo', ordem_dia: 7 },
        ])
        return
      }

      setDiasSemana(data || [])
    } catch (error) {
      console.error('Erro ao carregar dias:', error)
      // Usar dias padrão como fallback
      setDiasSemana([
        { id: '1', nome: 'Segunda-feira', ordem_dia: 1 },
        { id: '2', nome: 'Terça-feira', ordem_dia: 2 },
        { id: '3', nome: 'Quarta-feira', ordem_dia: 3 },
        { id: '4', nome: 'Quinta-feira', ordem_dia: 4 },
        { id: '5', nome: 'Sexta-feira', ordem_dia: 5 },
        { id: '6', nome: 'Sábado', ordem_dia: 6 },
        { id: '7', nome: 'Domingo', ordem_dia: 7 },
      ])
    }
  }

  useEffect(() => {
    loadDiasSemana()
  }, [])

  useEffect(() => {
    if (showExerciseModal) {
      loadExercises()
    }
  }, [showExerciseModal])

  const filteredExercises = exerciciosDisponiveis.filter(exercise =>
    exercise.nome.toLowerCase().includes(searchExercise.toLowerCase()) ||
    exercise.musculos.nome.toLowerCase().includes(searchExercise.toLowerCase())
  )

  const loadExercises = async () => {
    setLoadingExercises(true)
    try {
      const { data, error } = await (supabase as any)
        .from('exercicios')
        .select(`
          id,
          nome,
          musculo_id,
          equipamento,
          musculos!inner(nome)
        `)
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setExerciciosDisponiveis(data || [])
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error)
      toast.error('Erro ao carregar exercícios')
    } finally {
      setLoadingExercises(false)
    }
  }

  const addExercise = (exercise: ExerciseFromDB) => {
    const newExercise: Exercise = {
      id: exercise.id,
      nome: exercise.nome,
      musculo: exercise.musculos.nome,
      equipamento: exercise.equipamento || 'N/A',
      series: 3,
      repeticoes: 12,
      peso: 0,
      descanso: 60
    }
    
    setForm(prev => ({
      ...prev,
      exercicios: [...prev.exercicios, newExercise]
    }))
    
    setShowExerciseModal(false)
    setSearchExercise('')
    toast.success('Exercício adicionado!')
  }

  const removeExercise = (index: number) => {
    setForm(prev => ({
      ...prev,
      exercicios: prev.exercicios.filter((_, i) => i !== index)
    }))
    toast.success('Exercício removido!')
  }

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    setForm(prev => ({
      ...prev,
      exercicios: prev.exercicios.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.nome || !form.dia_treino_id || form.exercicios.length === 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)

    try {
      // Encontrar o ID correto do dia baseado na seleção
      const diaSelecionado = diasSemana.find(dia => dia.ordem_dia.toString() === form.dia_treino_id)
      if (!diaSelecionado) {
        toast.error('Dia da semana não encontrado')
        return
      }

      console.log('Dia selecionado:', diaSelecionado)
      console.log('Form data:', form)

      // 1. Criar sessão de treino
      const { data: sessaoData, error: sessaoError } = await (supabase as any)
        .from('sessoes_treino')
        .insert({
          usuario_id: user?.id, // Adicionar o ID do usuário
          nome: form.nome,
          descricao: form.descricao,
          dia_treino_id: diaSelecionado.id, // Usar o ID real do banco
          duracao_minutos: form.duracao_minutos,
          ativo: true
        })
        .select('id')
        .single()

      if (sessaoError) {
        console.error('Erro ao criar sessão:', sessaoError)
        throw sessaoError
      }

      const sessaoId = sessaoData.id

      // 2. Criar exercícios da sessão
      const exerciciosToInsert = form.exercicios.map((exercise, index) => ({
        sessao_treino_id: sessaoId,
        exercicio_id: exercise.id,
        ordem_exercicio: index + 1,
        series: exercise.series,
        repeticoes: exercise.repeticoes,
        peso_kg: exercise.peso,
        duracao_segundos: null,
        descanso_segundos: exercise.descanso,
        observacoes: null
      }))

      const { error: exerciciosError } = await (supabase as any)
        .from('exercicios_sessao')
        .insert(exerciciosToInsert)

      if (exerciciosError) {
        console.error('Erro ao criar exercícios:', exerciciosError)
        throw exerciciosError
      }
      
      toast.success('Treino criado com sucesso!')
      router.push('/dashboard/treino')
    } catch (error) {
      console.error('Erro ao criar treino:', error)
      toast.error('Erro ao criar treino')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/treino">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Treino</h1>
          <p className="text-muted-foreground mt-1">
            Crie um novo treino personalizado
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Defina as informações principais do seu treino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nome do Treino *
                  </label>
                  <Input
                    value={form.nome}
                    onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Peito e Tríceps"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Dia da Semana *
                  </label>
                  <select
                    value={form.dia_treino_id}
                    onChange={(e) => setForm(prev => ({ ...prev, dia_treino_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-fitness-500"
                    required
                  >
                    <option value="">Selecione o dia</option>
                    {diasSemana.map(dia => (
                      <option key={dia.id} value={dia.ordem_dia.toString()}>
                        {dia.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Descrição
                </label>
                <Input
                  value={form.descricao}
                  onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o foco do treino..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Duração Estimada (minutos)
                </label>
                <Input
                  type="number"
                  value={form.duracao_minutos}
                  onChange={(e) => setForm(prev => ({ ...prev, duracao_minutos: parseInt(e.target.value) || 0 }))}
                  min="1"
                  max="180"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Exercícios ({form.exercicios.length})
                  </CardTitle>
                  <CardDescription>
                    Adicione e configure os exercícios do treino
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowExerciseModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Exercício
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {form.exercicios.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Nenhum exercício adicionado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione exercícios para criar seu treino
                  </p>
                  <Button
                    type="button"
                    onClick={() => setShowExerciseModal(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Exercício
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {form.exercicios.map((exercise, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{exercise.nome}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{exercise.musculo}</Badge>
                            <Badge variant="outline">{exercise.equipamento}</Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Séries</label>
                          <Input
                            type="number"
                            value={exercise.series}
                            onChange={(e) => updateExercise(index, 'series', parseInt(e.target.value) || 0)}
                            min="1"
                            max="10"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Repetições</label>
                          <Input
                            type="number"
                            value={exercise.repeticoes}
                            onChange={(e) => updateExercise(index, 'repeticoes', parseInt(e.target.value) || 0)}
                            min="1"
                            max="50"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Peso (kg)</label>
                          <Input
                            type="number"
                            value={exercise.peso}
                            onChange={(e) => updateExercise(index, 'peso', parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.5"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Descanso (s)</label>
                          <Input
                            type="number"
                            value={exercise.descanso}
                            onChange={(e) => updateExercise(index, 'descanso', parseInt(e.target.value) || 0)}
                            min="0"
                            max="300"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end space-x-4"
        >
          <Button asChild variant="outline">
            <Link href="/dashboard/treino">
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Criar Treino'}
          </Button>
        </motion.div>
      </form>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Adicionar Exercício</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExerciseModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar exercícios..."
                  value={searchExercise}
                  onChange={(e) => setSearchExercise(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {loadingExercises ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando exercícios...</p>
                  </div>
                ) : filteredExercises.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchExercise ? 'Nenhum exercício encontrado' : 'Nenhum exercício cadastrado'}
                    </p>
                    {!searchExercise && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Cadastre exercícios em "Exercícios" para usá-los aqui
                      </p>
                    )}
                  </div>
                ) : (
                  filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                      onClick={() => addExercise(exercise)}
                    >
                      <div>
                        <h4 className="font-medium text-foreground">{exercise.nome}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{exercise.musculos.nome}</Badge>
                          {exercise.equipamento && (
                            <Badge variant="outline">{exercise.equipamento}</Badge>
                          )}
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
