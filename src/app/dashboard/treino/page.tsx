'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Clock, 
  Target,
  Calendar,
  CheckCircle,
  MoreVertical,
  Filter,
  Save,
  X,
  Video,
  BookOpen
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'
import { formatDate, getWeekDates, getDayName } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface WorkoutSession {
  id: string
  nome: string
  descricao: string
  dia_treino_id: string
  duracao_minutos: number
  ativo: boolean
  exercicios_count: number
  ultimo_treino?: string
  concluido_hoje: boolean
}

export default function TreinoPage() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ nome: '', descricao: '' })
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showExercises, setShowExercises] = useState<string | null>(null)
  const [workoutExercises, setWorkoutExercises] = useState<{[key: string]: any[]}>({})
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  // supabase já está importado

  const weekDays = getWeekDates(new Date())
  const today = new Date().getDay()

  useEffect(() => {
    loadWorkouts()
    loadDiasTreino()
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDropdown && !target.closest('[data-dropdown]')) {
        setShowDropdown(null)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const loadWorkouts = async () => {
    try {
      // Buscar treinos com contagem de exercícios
      const { data: treinosData, error: treinosError } = await (supabase as any)
        .from('sessoes_treino')
        .select(`
          *,
          exercicios_sessao(count)
        `)
        .eq('ativo', true)
        .order('criado_em', { ascending: false })

      if (treinosError) {
        console.error('Erro ao buscar treinos:', treinosError)
        throw treinosError
      }

      console.log('Treinos carregados:', treinosData)

      // Transformar dados do Supabase para o formato esperado
      const workouts: WorkoutSession[] = (treinosData || []).map((treino: any) => ({
        id: treino.id,
        nome: treino.nome || 'Treino sem nome',
        descricao: treino.descricao || 'Plano personalizado',
        dia_treino_id: treino.dia_treino_id || '1',
        duracao_minutos: treino.duracao_minutos || 0,
        ativo: treino.ativo,
        exercicios_count: treino.exercicios_sessao?.[0]?.count || 0,
        ultimo_treino: treino.criado_em ? new Date(treino.criado_em).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        concluido_hoje: false // Temporariamente false
      }))

      console.log('Workouts formatados:', workouts)
      setWorkouts(workouts)
    } catch (error) {
      console.error('Erro ao carregar treinos:', error)
      // Fallback: buscar treinos sem contagem
      try {
        const { data: treinosData, error: treinosError } = await (supabase as any)
          .from('sessoes_treino')
          .select('*')
          .eq('ativo', true)
          .order('criado_em', { ascending: false })

        if (!treinosError && treinosData) {
          const workouts: WorkoutSession[] = treinosData.map((treino: any) => ({
            id: treino.id,
            nome: treino.nome || 'Treino sem nome',
            descricao: treino.descricao || 'Plano personalizado',
            dia_treino_id: treino.dia_treino_id || '1',
            duracao_minutos: treino.duracao_minutos || 0,
            ativo: treino.ativo,
            exercicios_count: 0,
            ultimo_treino: treino.criado_em ? new Date(treino.criado_em).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            concluido_hoje: false
          }))
          setWorkouts(workouts)
        }
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError)
        setWorkouts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const [diasTreino, setDiasTreino] = useState<any[]>([])

  const loadDiasTreino = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('dias_treino')
        .select('*')
        .order('ordem_dia')

      if (error) {
        console.error('Erro ao buscar dias:', error)
        // Usar dias padrão se der erro
        setDiasTreino([
          { id: '1', nome: 'Segunda-feira', ordem_dia: 1, ativo: true, criado_em: new Date().toISOString() },
          { id: '2', nome: 'Terça-feira', ordem_dia: 2, ativo: true, criado_em: new Date().toISOString() },
          { id: '3', nome: 'Quarta-feira', ordem_dia: 3, ativo: true, criado_em: new Date().toISOString() },
          { id: '4', nome: 'Quinta-feira', ordem_dia: 4, ativo: true, criado_em: new Date().toISOString() },
          { id: '5', nome: 'Sexta-feira', ordem_dia: 5, ativo: true, criado_em: new Date().toISOString() },
          { id: '6', nome: 'Sábado', ordem_dia: 6, ativo: true, criado_em: new Date().toISOString() },
          { id: '7', nome: 'Domingo', ordem_dia: 7, ativo: true, criado_em: new Date().toISOString() },
        ])
        return
      }

      console.log('Dias carregados:', data)
      setDiasTreino(data || [])
    } catch (error) {
      console.error('Erro ao carregar dias:', error)
      // Usar dias padrão como fallback
      setDiasTreino([
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

  const getDayNameById = (dayId: string) => {
    const dia = diasTreino.find(d => d.id === dayId)
    return dia?.nome || 'Dia'
  }

  const handleEdit = (workout: WorkoutSession) => {
    console.log('Editando treino:', workout)
    setEditingId(workout.id)
    setEditForm({
      nome: workout.nome,
      descricao: workout.descricao
    })
    setShowDropdown(null)
  }

  const handleSaveEdit = async () => {
    console.log('Salvando edição:', { editingId, editForm })
    if (!editingId) return

    try {
      // Atualizar no estado local (em produção, salvaria no Supabase)
      setWorkouts(prev => prev.map(workout => 
        workout.id === editingId 
          ? { ...workout, nome: editForm.nome, descricao: editForm.descricao }
          : workout
      ))
      
      console.log('Treino atualizado com sucesso')
      setEditingId(null)
      setEditForm({ nome: '', descricao: '' })
    } catch (error) {
      console.error('Erro ao salvar edição:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ nome: '', descricao: '' })
  }

  const handleDelete = async (id: string) => {
    console.log('Excluindo treino:', id)
    if (!confirm('Tem certeza que deseja excluir este treino?')) return

    try {
      // Remover do estado local (em produção, excluiria do Supabase)
      setWorkouts(prev => prev.filter(workout => workout.id !== id))
      console.log('Treino excluído com sucesso')
      setShowDropdown(null)
    } catch (error) {
      console.error('Erro ao excluir treino:', error)
    }
  }

  const loadWorkoutExercises = async (workoutId: string) => {
    if (workoutExercises[workoutId]) return

    try {
      const { data, error } = await (supabase as any)
        .from('exercicios_sessao')
        .select(`
          *,
          exercicios(nome, video_url, instrucoes, descricao, musculos(nome))
        `)
        .eq('sessao_treino_id', workoutId)
        .order('ordem_exercicio')

      if (error) {
        console.error('Erro ao carregar exercícios:', error)
        return
      }

      const exercises = (data || []).map((ex: any) => ({
        id: ex.id,
        nome: ex.exercicios?.nome || ex.observacoes || 'Exercício',
        musculo: ex.exercicios?.musculos?.nome || 'Geral',
        series: ex.series || 1,
        repeticoes: ex.repeticoes || 12,
        peso: ex.peso_kg || 0,
        descanso: ex.descanso_segundos || 60,
        video_url: ex.exercicios?.video_url,
        instrucoes: ex.exercicios?.instrucoes,
        descricao: ex.exercicios?.descricao
      }))

      setWorkoutExercises(prev => ({
        ...prev,
        [workoutId]: exercises
      }))
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error)
    }
  }

  const toggleExercises = (workoutId: string) => {
    if (showExercises === workoutId) {
      setShowExercises(null)
    } else {
      setShowExercises(workoutId)
      loadWorkoutExercises(workoutId)
    }
  }

  const openVideoModal = (exercise: any) => {
    setSelectedExercise(exercise)
    setShowVideoModal(true)
  }

  const openInstructionsModal = (exercise: any) => {
    setSelectedExercise(exercise)
    setShowInstructionsModal(true)
  }

  const convertToEmbedUrl = (url: string) => {
    if (!url) return ''
    
    // YouTube Shorts
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // YouTube regular videos
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    
    // YouTube embed format (already correct)
    if (url.includes('youtube.com/embed/')) {
      return url
    }
    
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }
    
    // Return original URL if no conversion needed
    return url
  }

  const filteredWorkouts = selectedDay === 'all' 
    ? workouts 
    : workouts.filter(workout => workout.dia_treino_id === selectedDay)

  const todayWorkout = workouts.find(workout => 
    workout.dia_treino_id === today.toString() && workout.ativo
  )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meus Treinos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus treinos e acompanhe seu progresso
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link href="/dashboard/treino/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Treino
            </Link>
          </Button>
        </div>
      </div>


      {/* Today's Workout Highlight */}
      {todayWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-fitness-200/30 bg-gradient-to-r from-fitness-950/20 to-fitness-900/10 dark:from-fitness-900/30 dark:to-fitness-800/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-fitness-600" />
                    Treino de Hoje
                  </CardTitle>
                  <CardDescription>
                    {todayWorkout.nome} • {getDayNameById(todayWorkout.dia_treino_id)}
                  </CardDescription>
                </div>
                <Badge variant={todayWorkout.concluido_hoje ? "success" : "fitness"}>
                  {todayWorkout.concluido_hoje ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Concluído
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-3 w-3" />
                      Pendente
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {todayWorkout.duracao_minutos} minutos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {todayWorkout.exercicios_count} exercícios
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Último: {formatDate(new Date(todayWorkout.ultimo_treino || ''))}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/dashboard/treino/${todayWorkout.id}/executar`}>
                    <Play className="mr-2 h-4 w-4" />
                    {todayWorkout.concluido_hoje ? 'Ver Detalhes' : 'Iniciar Treino'}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/treino/${todayWorkout.id}/editar?day=${todayWorkout.dia_treino_id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Week Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDay === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedDay('all')}
        >
          Todos
        </Button>
        {weekDays.map((day, index) => (
          <Button
            key={index}
            variant={selectedDay === (index + 1).toString() ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay((index + 1).toString())}
          >
            {getDayName(day).slice(0, 3)}
          </Button>
        ))}
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map((workout, index) => (
          <motion.div
            key={workout.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingId === workout.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.nome}
                          onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                          className="w-full px-2 py-1 text-lg font-semibold bg-background border border-input rounded"
                          placeholder="Nome do treino"
                        />
                        <input
                          type="text"
                          value={editForm.descricao}
                          onChange={(e) => setEditForm(prev => ({ ...prev, descricao: e.target.value }))}
                          className="w-full px-2 py-1 text-sm text-muted-foreground bg-background border border-input rounded"
                          placeholder="Descrição do treino"
                        />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-lg">{workout.nome}</CardTitle>
                        <CardDescription className="mt-1">
                          {workout.descricao}
                        </CardDescription>
                      </>
                    )}
                  </div>
                  <div className="relative">
                    {editingId === workout.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Clicando no dropdown para workout:', workout.id)
                          setShowDropdown(showDropdown === workout.id ? null : workout.id)
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Dropdown Menu */}
                    {showDropdown === workout.id && (
                      <div 
                        data-dropdown
                        className="absolute right-0 top-8 z-10 w-48 bg-background border border-border rounded-md shadow-lg"
                      >
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleEdit(workout)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                          >
                            <Edit className="mr-3 h-4 w-4" />
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDelete(workout.id)
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getDayNameById(workout.dia_treino_id)}
                  </Badge>
                  {workout.concluido_hoje && (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Hoje
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {workout.duracao_minutos}min
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {workout.exercicios_count} ex.
                      </span>
                    </div>
                  </div>
                  
                  {workout.ultimo_treino && (
                    <div className="text-xs text-muted-foreground">
                      Último treino: {formatDate(new Date(workout.ultimo_treino))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/dashboard/treino/${workout.id}/executar`}>
                        <Play className="mr-1 h-3 w-3" />
                        {workout.concluido_hoje ? 'Ver' : 'Iniciar'}
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleExercises(workout.id)}
                    >
                      <Dumbbell className="h-3 w-3 mr-1" />
                      Exercícios
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/treino/${workout.id}/editar?day=${workout.dia_treino_id}`}>
                        <Edit className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercícios Expandidos */}
            {showExercises === workout.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exercícios do Treino</CardTitle>
                    <CardDescription>Clique nos ícones para ver vídeo ou instruções</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workoutExercises[workout.id]?.map((exercise, index) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-fitness-100 text-fitness-600 flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{exercise.nome}</h4>
                              <p className="text-sm text-muted-foreground">
                                {exercise.series} séries × {exercise.repeticoes} reps • {exercise.peso}kg • {exercise.descanso}s
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {exercise.video_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openVideoModal(exercise)}
                                className="h-8 w-8 p-0"
                                title="Ver vídeo"
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            )}
                            {exercise.instrucoes && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openInstructionsModal(exercise)}
                                className="h-8 w-8 p-0"
                                title="Ver instruções"
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkouts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum treino encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {selectedDay === 'all' 
              ? 'Crie seu primeiro treino para começar sua jornada fitness!'
              : 'Não há treinos programados para este dia.'
            }
          </p>
          <Button asChild>
            <Link href="/dashboard/treino/novo">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Treino
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Modal de Vídeo */}
      {showVideoModal && selectedExercise?.video_url && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Vídeo do Exercício</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVideoModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <div className="aspect-video w-full">
                <iframe
                  src={convertToEmbedUrl(selectedExercise.video_url)}
                  title={`Vídeo do exercício ${selectedExercise.nome}`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={(e) => {
                    console.error('Erro ao carregar vídeo:', e)
                    window.open(selectedExercise.video_url, '_blank')
                  }}
                />
              </div>
              <div className="mt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedExercise.video_url, '_blank')}
                  className="text-xs"
                >
                  Abrir no YouTube
                </Button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{selectedExercise.nome}</h3>
                <p className="text-muted-foreground">{selectedExercise.musculo}</p>
                {selectedExercise.descricao && (
                  <p className="text-sm text-muted-foreground mt-2">{selectedExercise.descricao}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Instruções */}
      {showInstructionsModal && selectedExercise?.instrucoes && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Instruções do Exercício</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructionsModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{selectedExercise.nome}</h3>
                <p className="text-muted-foreground mb-4">{selectedExercise.musculo}</p>
                {selectedExercise.descricao && (
                  <p className="text-sm text-muted-foreground mb-4">{selectedExercise.descricao}</p>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedExercise.instrucoes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
