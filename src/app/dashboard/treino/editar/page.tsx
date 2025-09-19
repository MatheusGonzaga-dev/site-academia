'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dumbbell, Plus, Save, Trash2, Search, ChevronLeft, X } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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

interface DayPlan {
  dayId: number // 1..7 (Seg..Dom)
  title: string
  exercises: ExerciseRow[]
}

interface DiaTreino {
  id: string
  nome: string
  ordem_dia: number
  ativo: boolean
}

export default function EditWeeklyWorkoutPage() {
  const params = useSearchParams()
  const initialDay = params.get('day') || '1'
  const { user } = useAuth()
  
  const [exerciseCatalog, setExerciseCatalog] = useState<any[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [diasTreino, setDiasTreino] = useState<DiaTreino[]>([])
  const [plans, setPlans] = useState<DayPlan[]>([])
  const [activeTab, setActiveTab] = useState<string>(initialDay)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingDias, setLoadingDias] = useState(true)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const [currentDayId, setCurrentDayId] = useState<number | null>(null)

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
        setLoadingCatalog(false)
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
    setLoadingDias(true)
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
        
        const newPlans: DayPlan[] = diasPadrao.map(dia => ({
          dayId: dia.ordem_dia,
          title: dia.nome,
          exercises: []
        }))
        setPlans(newPlans)
        setLoadingDias(false)
        return
      }
      
      setDiasTreino(data || [])
      
      // Criar plans baseado nos dias do banco
      const newPlans: DayPlan[] = (data || []).map((dia: any) => ({
        dayId: dia.ordem_dia,
        title: dia.nome,
        exercises: []
      }))
      setPlans(newPlans)
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
      
      const newPlans: DayPlan[] = diasPadrao.map(dia => ({
        dayId: dia.ordem_dia,
        title: dia.nome,
        exercises: []
      }))
      setPlans(newPlans)
    } finally {
      setLoadingDias(false)
    }
  }

  useEffect(() => {
    loadExerciseCatalog()
    loadDiasTreino()
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!search.trim()) return exerciseCatalog.slice(0, 6)
    return exerciseCatalog.filter(x => x.nome.toLowerCase().includes(search.toLowerCase())).slice(0, 10)
  }, [search, exerciseCatalog])

  const filteredModalSuggestions = exerciseCatalog.filter(x => 
    x.nome.toLowerCase().includes(modalSearch.toLowerCase())
  ).slice(0, 20)

  // Se a query mudar enquanto a página está aberta, sincroniza
  useEffect(() => {
    const q = params.get('day')
    if (q && q !== activeTab) setActiveTab(q)
  }, [params])

  const addExercise = (dayId: number, exerciseId?: string, exerciseName?: string) => {
    setPlans(prev => prev.map(p => {
      if (p.dayId !== dayId) return p
      const newRow: ExerciseRow = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        exerciseId: exerciseId,
        name: exerciseName || 'Novo exercício',
        sets: 3,
        reps: '10-12',
        weightKg: undefined,
        restSec: 60,
      }
      return { ...p, exercises: [...p.exercises, newRow] }
    }))
    setShowExerciseModal(false)
    setModalSearch('')
  }

  const addExerciseFromModal = (exerciseId: string, exerciseName: string) => {
    if (currentDayId) {
      addExercise(currentDayId, exerciseId, exerciseName)
    }
  }

  const addEmptyExercise = (dayId: number) => {
    addExercise(dayId)
  }

  const openExerciseModal = (dayId: number) => {
    setCurrentDayId(dayId)
    setShowExerciseModal(true)
  }

  const removeExercise = (dayId: number, id: string) => {
    setPlans(prev => prev.map(p => p.dayId === dayId ? { ...p, exercises: p.exercises.filter(e => e.id !== id) } : p))
  }

  const updateExercise = (dayId: number, id: string, patch: Partial<ExerciseRow>) => {
    setPlans(prev => prev.map(p => {
      if (p.dayId !== dayId) return p
      return {
        ...p,
        exercises: p.exercises.map(e => e.id === id ? { ...e, ...patch } : e)
      }
    }))
  }

  async function getDiaTreinoIdByOrdem(ordem: number): Promise<string | null> {
    const { data, error } = await (supabase as any)
      .from('dias_treino')
      .select('id, ordem_dia')
      .eq('ordem_dia', ordem)
      .single()
    if (error) {
      console.error('Erro buscando dia_treino:', error)
      return null
    }
    return data?.id ?? null
  }

  function parseRepsToInt(reps: string): number | null {
    if (!reps) return null
    const m = reps.match(/\d+/)
    return m ? parseInt(m[0]) : null
  }

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    setSaving(true)
    try {
      // Usar os dias já carregados
      const diaIdMap = new Map(diasTreino.map(d => [d.ordem_dia, d.id]))

      for (const day of plans) {
        // Apenas salva dias com exercícios
        if (day.exercises.length === 0) continue

        const diaTreinoId = diaIdMap.get(day.dayId)
        if (!diaTreinoId) {
          console.warn('Dia treino não encontrado para ordem', day.dayId)
          continue
        }

        // Upsert sessão (uma por usuário+dia)
        const { data: existingSession, error: findErr } = await (supabase as any)
          .from('sessoes_treino')
          .select('id')
          .eq('usuario_id', user.id)
          .eq('dia_treino_id', diaTreinoId)
          .maybeSingle()
        if (findErr) {
          console.error('Erro ao buscar sessão:', findErr)
          continue
        }

        let sessionId = existingSession?.id
        if (!sessionId) {
          const { data: created, error: createErr } = await (supabase as any)
            .from('sessoes_treino')
            .insert({
              usuario_id: user.id,
              nome: `Treino de ${day.title}`,
              descricao: 'Plano personalizado',
              dia_treino_id: diaTreinoId,
              ativo: true,
            })
            .select('id')
            .single()
          if (createErr) {
            console.error('Erro ao criar sessão:', createErr)
            continue
          }
          sessionId = created.id
        } else {
          // Atualizar nome/descricao
          await (supabase as any)
            .from('sessoes_treino')
            .update({ nome: `Treino de ${day.title}`, descricao: 'Plano personalizado', ativo: true })
            .eq('id', sessionId)
        }

        // Substituir exercícios da sessão
        const del = await (supabase as any)
          .from('historico_exercicios')
          .select('id')
          .limit(1)
        // Apenas para esquentar conexão (evitar erro de idle). Ignorar
        void del

        const { error: delErr } = await (supabase as any)
          .from('exercicios_sessao')
          .delete()
          .eq('sessao_treino_id', sessionId)
        if (delErr) {
          console.error('Erro ao limpar exercícios:', delErr)
          continue
        }

        const rows = day.exercises.map((ex, idx) => ({
          sessao_treino_id: sessionId as string,
          exercicio_id: ex.exerciseId || null,
          ordem_exercicio: idx + 1,
          series: ex.sets || 1,
          repeticoes: parseRepsToInt(ex.reps),
          peso_kg: ex.weightKg ?? null,
          duracao_segundos: null,
          descanso_segundos: ex.restSec ?? 60,
          observacoes: ex.exerciseId ? null : ex.name, // só usa observações se não tiver exercicio_id
        }))

        if (rows.length > 0) {
          const { error: insErr } = await (supabase as any)
            .from('exercicios_sessao')
            .insert(rows)
          if (insErr) {
            console.error('Erro ao inserir exercícios:', insErr)
            continue
          }
        }
      }

      toast.success('Treinos salvos com sucesso!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao salvar treinos')
    } finally {
      setSaving(false)
    }
  }

  if (loadingDias || loadingCatalog) {
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
            <h1 className="text-2xl font-bold text-foreground">Editar Treinos da Semana</h1>
            <p className="text-sm text-muted-foreground">Monte seus treinos por dia, adicionando exercícios e parâmetros</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dias da semana</CardTitle>
          <CardDescription>Selecione um dia para personalizar a lista de exercícios</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded-md">
              {plans.map(p => (
                <TabsTrigger key={p.dayId} value={String(p.dayId)} className="px-3 py-1.5">
                  {p.title}
                  {p.exercises.length > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">{p.exercises.length}</Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {plans.map(p => (
              <TabsContent key={p.dayId} value={String(p.dayId)} className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Editor */}
                  <div className="lg:col-span-2 space-y-4">
                    {p.exercises.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="py-10 text-center">
                          <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">Sem exercícios para {p.title}. Adicione abaixo.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      p.exercises.map(ex => (
                        <Card key={ex.id} className="card-hover">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <Input
                                value={ex.name}
                                onChange={(e) => updateExercise(p.dayId, ex.id, { name: e.target.value })}
                                className="flex-1"
                              />
                              <Button variant="ghost" size="sm" onClick={() => removeExercise(p.dayId, ex.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground">Séries</label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={ex.sets}
                                  onChange={(e) => updateExercise(p.dayId, ex.id, { sets: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Repetições</label>
                                <Input
                                  value={ex.reps}
                                  onChange={(e) => updateExercise(p.dayId, ex.id, { reps: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Carga (kg)</label>
                                <Input
                                  type="number"
                                  value={ex.weightKg ?? ''}
                                  onChange={(e) => updateExercise(p.dayId, ex.id, { weightKg: e.target.value === '' ? undefined : Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Descanso (s)</label>
                                <Input
                                  type="number"
                                  value={ex.restSec ?? 60}
                                  onChange={(e) => updateExercise(p.dayId, ex.id, { restSec: Number(e.target.value) })}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    <div className="flex gap-3">
                      <Button onClick={() => openExerciseModal(p.dayId)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar exercício
                      </Button>
                      <Button variant="outline" onClick={() => addEmptyExercise(p.dayId)}>
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
                                  onClick={() => addExercise(p.dayId, exercise.id, exercise.nome)}
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

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
                onClick={() => currentDayId && addEmptyExercise(currentDayId)}
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
