'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Plus, Save, Trash2, Search, ChevronLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/components/providers'

interface ExerciseRow {
  id: string
  exerciseId?: string
  name: string
  sets: number
  reps: string
  weightKg?: number
  restSec?: number
}

interface WorkoutSession {
  id: string
  nome: string
  descricao: string
  dia_treino_id: string
  duracao_minutos: number
  ativo: boolean
}

interface DiaTreino {
  id: string
  nome: string
  ordem_dia: number
  ativo: boolean
}

export default function EditWorkoutByIdPage() {
  const params = useParams()
  const workoutId = params.id as string
  const { user } = useAuth()
  
  const [workout, setWorkout] = useState<WorkoutSession | null>(null)
  const [exercises, setExercises] = useState<ExerciseRow[]>([])
  const [exerciseCatalog, setExerciseCatalog] = useState<any[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [diasTreino, setDiasTreino] = useState<DiaTreino[]>([])
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [modalSearch, setModalSearch] = useState('')

  const loadWorkout = async () => {
    if (!workoutId) return

    try {
      // Carregar dados do treino
      const { data: workoutData, error: workoutError } = await (supabase as any)
        .from('sessoes_treino')
        .select('*')
        .eq('id', workoutId)
        .single()

      if (workoutError) {
        console.error('Erro ao carregar treino:', workoutError)
        toast.error('Erro ao carregar treino')
        return
      }

      setWorkout(workoutData)

      // Carregar exercícios do treino
      const { data: exercisesData, error: exercisesError } = await (supabase as any)
        .from('exercicios_sessao')
        .select(`
          *,
          exercicios(nome)
        `)
        .eq('sessao_treino_id', workoutId)
        .order('ordem_exercicio')

      if (exercisesError) {
        console.error('Erro ao carregar exercícios:', exercisesError)
        toast.error('Erro ao carregar exercícios')
        return
      }

      // Transformar dados dos exercícios
      const exercisesList: ExerciseRow[] = (exercisesData || []).map((ex: any) => ({
        id: ex.id,
        exerciseId: ex.exercicio_id,
        name: ex.observacoes || ex.exercicios?.nome || 'Exercício sem nome',
        sets: ex.series || 1,
        reps: ex.repeticoes?.toString() || '10-12',
        weightKg: ex.peso_kg,
        restSec: ex.descanso_segundos || 60,
      }))

      setExercises(exercisesList)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do treino')
    } finally {
      setLoading(false)
    }
  }

  const loadExerciseCatalog = async () => {
    setLoadingCatalog(true)
    try {
      const { data, error } = await (supabase as any)
        .from('exercicios')
        .select(`
          id,
          nome,
          musculo_id,
          musculos(nome)
        `)
        .eq('ativo', true)
        .order('nome')
      
      if (error) {
        console.error('Erro ao carregar catálogo:', error)
        setExerciseCatalog([])
        return
      }
      
      setExerciseCatalog(data || [])
    } catch (error) {
      console.error('Erro ao carregar catálogo:', error)
      setExerciseCatalog([])
    } finally {
      setLoadingCatalog(false)
    }
  }

  const loadDiasTreino = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('dias_treino')
        .select('*')
        .order('ordem_dia')
      
      if (error) {
        console.error('Erro ao carregar dias:', error)
        // Usar dias padrão se der erro
        const diasPadrao = [
          { id: '1', nome: 'Segunda-feira', ordem_dia: 1, ativo: true, criado_em: new Date().toISOString() },
          { id: '2', nome: 'Terça-feira', ordem_dia: 2, ativo: true, criado_em: new Date().toISOString() },
          { id: '3', nome: 'Quarta-feira', ordem_dia: 3, ativo: true, criado_em: new Date().toISOString() },
          { id: '4', nome: 'Quinta-feira', ordem_dia: 4, ativo: true, criado_em: new Date().toISOString() },
          { id: '5', nome: 'Sexta-feira', ordem_dia: 5, ativo: true, criado_em: new Date().toISOString() },
          { id: '6', nome: 'Sábado', ordem_dia: 6, ativo: true, criado_em: new Date().toISOString() },
          { id: '7', nome: 'Domingo', ordem_dia: 7, ativo: true, criado_em: new Date().toISOString() },
        ]
        setDiasTreino(diasPadrao)
        return
      }
      
      setDiasTreino(data || [])
    } catch (error) {
      console.error('Erro ao carregar dias:', error)
      // Usar dias padrão como fallback
      const diasPadrao = [
        { id: '1', nome: 'Segunda-feira', ordem_dia: 1, ativo: true, criado_em: new Date().toISOString() },
        { id: '2', nome: 'Terça-feira', ordem_dia: 2, ativo: true, criado_em: new Date().toISOString() },
        { id: '3', nome: 'Quarta-feira', ordem_dia: 3, ativo: true, criado_em: new Date().toISOString() },
        { id: '4', nome: 'Quinta-feira', ordem_dia: 4, ativo: true, criado_em: new Date().toISOString() },
        { id: '5', nome: 'Sexta-feira', ordem_dia: 5, ativo: true, criado_em: new Date().toISOString() },
        { id: '6', nome: 'Sábado', ordem_dia: 6, ativo: true, criado_em: new Date().toISOString() },
        { id: '7', nome: 'Domingo', ordem_dia: 7, ativo: true, criado_em: new Date().toISOString() },
      ]
      setDiasTreino(diasPadrao)
    }
  }

  useEffect(() => {
    loadWorkout()
    loadExerciseCatalog()
    loadDiasTreino()
  }, [workoutId])

  const filteredSuggestions = exerciseCatalog.filter(x => 
    x.nome.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10)

  const filteredModalSuggestions = exerciseCatalog.filter(x => 
    x.nome.toLowerCase().includes(modalSearch.toLowerCase())
  ).slice(0, 20)

  const addExercise = (exerciseId?: string, exerciseName?: string) => {
    const newRow: ExerciseRow = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      exerciseId: exerciseId,
      name: exerciseName || 'Novo exercício',
      sets: 3,
      reps: '10-12',
      weightKg: undefined,
      restSec: 60,
    }
    setExercises(prev => [...prev, newRow])
    setShowExerciseModal(false)
    setModalSearch('')
  }

  const addExerciseFromModal = (exerciseId: string, exerciseName: string) => {
    addExercise(exerciseId, exerciseName)
  }

  const addEmptyExercise = () => {
    addExercise()
  }

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const updateExercise = (id: string, patch: Partial<ExerciseRow>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  }

  const getDayName = () => {
    if (!workout) return 'Dia'
    const dia = diasTreino.find(d => d.id === workout.dia_treino_id)
    return dia?.nome || 'Dia'
  }

  function parseRepsToInt(reps: string): number | null {
    if (!reps) return null
    const m = reps.match(/\d+/)
    return m ? parseInt(m[0]) : null
  }

  const handleSave = async () => {
    if (!user?.id || !workout) {
      toast.error('Usuário não autenticado ou treino não encontrado')
      return
    }

    setSaving(true)
    try {
      // Atualizar dados do treino
      const { error: updateError } = await (supabase as any)
        .from('sessoes_treino')
        .update({
          nome: workout.nome,
          descricao: workout.descricao,
        })
        .eq('id', workoutId)

      if (updateError) {
        console.error('Erro ao atualizar treino:', updateError)
        toast.error('Erro ao atualizar treino')
        return
      }

      // Limpar exercícios existentes
      const { error: deleteError } = await (supabase as any)
        .from('exercicios_sessao')
        .delete()
        .eq('sessao_treino_id', workoutId)

      if (deleteError) {
        console.error('Erro ao limpar exercícios:', deleteError)
        toast.error('Erro ao limpar exercícios')
        return
      }

      // Inserir novos exercícios
      if (exercises.length > 0) {
        const rows = exercises.map((ex, idx) => ({
          sessao_treino_id: workoutId,
          exercicio_id: ex.exerciseId || null,
          ordem_exercicio: idx + 1,
          series: ex.sets || 1,
          repeticoes: parseRepsToInt(ex.reps),
          peso_kg: ex.weightKg ?? null,
          duracao_segundos: null,
          descanso_segundos: ex.restSec ?? 60,
          observacoes: ex.exerciseId ? null : ex.name,
        }))

        const { error: insertError } = await (supabase as any)
          .from('exercicios_sessao')
          .insert(rows)

        if (insertError) {
          console.error('Erro ao inserir exercícios:', insertError)
          toast.error('Erro ao salvar exercícios')
          return
        }
      }

      toast.success('Treino atualizado com sucesso!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao salvar treino')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            Treino não encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            O treino que você está tentando editar não foi encontrado.
          </p>
          <Button asChild>
            <Link href="/dashboard/treino">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Treinos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/treino">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Editar Treino</h1>
            <p className="text-sm text-muted-foreground">
              {workout.nome} • {getDayName()}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>

      {/* Informações do Treino */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Treino</CardTitle>
          <CardDescription>Edite as informações básicas do treino</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nome do Treino</label>
              <Input
                value={workout.nome}
                onChange={(e) => setWorkout(prev => prev ? { ...prev, nome: e.target.value } : null)}
                placeholder="Nome do treino"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Input
                value={workout.descricao}
                onChange={(e) => setWorkout(prev => prev ? { ...prev, descricao: e.target.value } : null)}
                placeholder="Descrição do treino"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercícios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Exercícios</h2>
            <Badge variant="outline">{exercises.length} exercícios</Badge>
          </div>

          {exercises.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center">
                <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Nenhum exercício adicionado. Adicione abaixo.</p>
              </CardContent>
            </Card>
          ) : (
            exercises.map(ex => (
              <Card key={ex.id} className="card-hover">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      value={ex.name}
                      onChange={(e) => updateExercise(ex.id, { name: e.target.value })}
                      className="flex-1"
                      placeholder="Nome do exercício"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeExercise(ex.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Séries</label>
                      <Input
                        type="number"
                        min={1}
                        value={ex.sets}
                        onChange={(e) => updateExercise(ex.id, { sets: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Repetições</label>
                      <Input
                        value={ex.reps}
                        onChange={(e) => updateExercise(ex.id, { reps: e.target.value })}
                        placeholder="10-12"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Carga (kg)</label>
                      <Input
                        type="number"
                        value={ex.weightKg ?? ''}
                        onChange={(e) => updateExercise(ex.id, { weightKg: e.target.value === '' ? undefined : Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Descanso (s)</label>
                      <Input
                        type="number"
                        value={ex.restSec ?? 60}
                        onChange={(e) => updateExercise(ex.id, { restSec: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <div className="flex gap-3">
            <Button onClick={() => setShowExerciseModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar exercício
            </Button>
            <Button variant="outline" onClick={addEmptyExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Exercício personalizado
            </Button>
          </div>
        </div>

        {/* Sugestões */}
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Sugestões</CardTitle>
              <CardDescription>Pesquise e adicione rapidamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar exercício"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                {loadingCatalog ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Carregando exercícios...
                  </div>
                ) : filteredSuggestions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum exercício encontrado
                  </div>
                ) : (
                  filteredSuggestions.map(exercise => (
                    <div key={exercise.id} className="flex items-center justify-between rounded border border-border p-2">
                      <div>
                        <span className="text-sm font-medium">{exercise.nome}</span>
                        {exercise.musculos && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({exercise.musculos.nome})
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addExercise(exercise.id, exercise.nome)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Seleção de Exercícios */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Selecionar Exercício</h2>
                <p className="text-sm text-muted-foreground">
                  Escolha um exercício da sua biblioteca
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowExerciseModal(false)
                  setModalSearch('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar exercício..."
                  className="pl-9"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  autoFocus
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {loadingCatalog ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Carregando exercícios...
                  </div>
                ) : filteredModalSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {modalSearch ? 'Nenhum exercício encontrado' : 'Nenhum exercício cadastrado'}
                  </div>
                ) : (
                  filteredModalSuggestions.map(exercise => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => addExerciseFromModal(exercise.id, exercise.nome)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{exercise.nome}</div>
                        {exercise.musculos && (
                          <div className="text-sm text-muted-foreground">
                            {exercise.musculos.nome}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Selecionar
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/30">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExerciseModal(false)
                  setModalSearch('')
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={addEmptyExercise}
                variant="secondary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar personalizado
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
