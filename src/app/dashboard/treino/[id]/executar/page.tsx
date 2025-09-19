'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Clock,
  Target,
  CheckCircle,
  Timer,
  Dumbbell,
  Video,
  BookOpen,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/components/providers'

interface Exercise {
  id: string
  nome: string
  musculo: string
  series: number
  repeticoes: number
  peso: number
  descanso: number
  observacoes?: string
  video_url?: string
  instrucoes?: string
  descricao?: string
}

interface WorkoutSession {
  id: string
  nome: string
  descricao: string
  duracao_minutos: number
  exercicios: Exercise[]
}

export default function ExecutarTreinoPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const workoutId = params.id as string

  const [workout, setWorkout] = useState<WorkoutSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null)
  const [isRestPaused, setIsRestPaused] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)
  const [progressLoaded, setProgressLoaded] = useState(false)

  const loadWorkout = async () => {
    try {
      const { data: workoutData, error: workoutError } = await (supabase as any)
        .from('sessoes_treino')
        .select(`
          *,
          exercicios_sessao(
            *,
            exercicios(nome, video_url, instrucoes, descricao, musculos(nome))
          )
        `)
        .eq('id', workoutId)
        .eq('ativo', true)
        .single()

      if (workoutError) {
        console.error('Erro ao carregar treino:', workoutError)
        toast.error('Treino não encontrado')
        router.push('/dashboard/treino')
        return
      }

      const exercicios: Exercise[] = (workoutData.exercicios_sessao || []).map((ex: any) => ({
        id: ex.id,
        nome: ex.exercicios?.nome || ex.observacoes || 'Exercício',
        musculo: ex.exercicios?.musculos?.nome || 'Geral',
        series: ex.series || 1,
        repeticoes: ex.repeticoes || 12,
        peso: ex.peso_kg || 0,
        descanso: ex.descanso_segundos || 60,
        observacoes: ex.observacoes,
        video_url: ex.exercicios?.video_url,
        instrucoes: ex.exercicios?.instrucoes,
        descricao: ex.exercicios?.descricao
      }))


      setWorkout({
        id: workoutData.id,
        nome: workoutData.nome,
        descricao: workoutData.descricao,
        duracao_minutos: workoutData.duracao_minutos,
        exercicios
      })
    } catch (error) {
      console.error('Erro ao carregar treino:', error)
      toast.error('Erro ao carregar treino')
      router.push('/dashboard/treino')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (workoutId) {
      loadWorkout()
    }
  }, [workoutId])

  useEffect(() => {
    if (workout) {
      loadProgress()
    }
  }, [workout])

  // Salvar progresso automaticamente quando mudar
  useEffect(() => {
    if (progressLoaded && workout) {
      saveProgress()
    }
  }, [currentExerciseIndex, currentSet, completedSets, progressLoaded, workout])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0 && !isRestPaused) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false)
      setIsRunning(false)
      setIsRestPaused(false)
      toast.success('Descanso finalizado!')
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, isResting, isRestPaused])

  const startWorkout = () => {
    setWorkoutStartTime(new Date())
    setIsRunning(true)
    toast.success('Treino iniciado!')
  }

  const pauseWorkout = () => {
    setIsRunning(false)
  }

  const resumeWorkout = () => {
    setIsRunning(true)
  }

  const skipRest = () => {
    if (!isResting) return
    
    setIsResting(false)
    setIsRunning(false)
    setTimeLeft(0)
    toast('Descanso pulado!')
    
    // Se ainda há séries restantes, continuar para a próxima série
    if (!workout) return
    const currentExercise = workout.exercicios[currentExerciseIndex]
    
    if (currentSet < currentExercise.series) {
      // Ainda há séries restantes no exercício atual
      setCurrentSet(currentSet + 1)
    } else {
      // Exercício completo, ir para o próximo
      setCompletedSets([])
      setCurrentSet(1)
      
      if (currentExerciseIndex < workout.exercicios.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        toast.success('Próximo exercício!')
      } else {
        // Treino completo
        setIsRunning(false)
        toast.success('Parabéns! Treino concluído!')
      }
    }
  }

  const startRest = () => {
    if (!workout) return
    const currentExercise = workout.exercicios[currentExerciseIndex]
    setTimeLeft(currentExercise.descanso)
    setIsResting(true)
    setIsRunning(true)
    setIsRestPaused(false)
    toast(`Descanso: ${currentExercise.descanso}s`)
  }

  const pauseRest = () => {
    setIsRestPaused(true)
    setIsRunning(false)
    toast('Descanso pausado')
  }

  const resumeRest = () => {
    setIsRestPaused(false)
    setIsRunning(true)
    toast('Descanso retomado')
  }

  const completeSet = () => {
    if (!workout) return
    const currentExercise = workout.exercicios[currentExerciseIndex]
    
    setCompletedSets(prev => [...prev, currentSet])
    
    if (currentSet < currentExercise.series) {
      setCurrentSet(currentSet + 1)
      startRest()
    } else {
      // Exercício completo
      toast.success('Exercício concluído!')
      
      setCompletedSets([])
      setCurrentSet(1)
      
      if (currentExerciseIndex < workout.exercicios.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        startRest()
      } else {
        // Treino completo
        setIsRunning(false)
        toast.success('Parabéns! Treino concluído!')
      }
    }
  }

  const skipExercise = () => {
    if (!workout) return
    if (currentExerciseIndex < workout.exercicios.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSet(1)
      setCompletedSets([])
      toast('Exercício pulado')
    }
  }

  const resetWorkout = () => {
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    setCompletedSets([])
    setIsRunning(false)
    setTimeLeft(0)
    setIsResting(false)
    setIsRestPaused(false)
    setWorkoutStartTime(null)
    
    // Limpar progresso salvo
    if (workout) {
      const weekYear = getWeekYear(new Date())
      const storageKey = `workout_progress_${workoutId}_${weekYear}`
      localStorage.removeItem(storageKey)
    }
    
    toast('Treino reiniciado')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

  const getWeekYear = (date: Date) => {
    const year = date.getFullYear()
    const week = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7)
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  const saveProgress = () => {
    if (!workout) return

    try {
      const currentExercise = workout.exercicios[currentExerciseIndex]
      const weekYear = getWeekYear(new Date())
      
      const progressData = {
        workoutId,
        exerciseId: currentExercise.id,
        exerciseIndex: currentExerciseIndex,
        currentSet,
        completedSets,
        weekYear,
        completed: completedSets.length >= currentExercise.series,
        lastUpdated: new Date().toISOString()
      }

      // Salvar no localStorage
      const storageKey = `workout_progress_${workoutId}_${weekYear}`
      localStorage.setItem(storageKey, JSON.stringify(progressData))
      
      console.log('Progresso salvo:', progressData)
    } catch (error) {
      console.error('Erro ao salvar progresso:', error)
    }
  }

  const loadProgress = () => {
    if (!workout || progressLoaded) return

    try {
      const weekYear = getWeekYear(new Date())
      const storageKey = `workout_progress_${workoutId}_${weekYear}`
      const savedProgress = localStorage.getItem(storageKey)

      if (savedProgress) {
        const progressData = JSON.parse(savedProgress)
        
        // Verificar se é da mesma semana
        if (progressData.weekYear === weekYear) {
          setCurrentExerciseIndex(progressData.exerciseIndex || 0)
          setCurrentSet(progressData.currentSet || 1)
          setCompletedSets(progressData.completedSets || [])
          
          toast('Progresso carregado! Continuando de onde parou.')
          console.log('Progresso carregado:', progressData)
        }
      }
      
      setProgressLoaded(true)
    } catch (error) {
      console.error('Erro ao carregar progresso:', error)
      setProgressLoaded(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando treino...</p>
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Treino não encontrado</h2>
            <p className="text-muted-foreground mb-4">Este treino não existe ou foi removido.</p>
            <Button onClick={() => router.push('/dashboard/treino')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Treinos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = workout.exercicios[currentExerciseIndex]
  const progress = workout.exercicios.length > 0 ? ((currentExerciseIndex + 1) / workout.exercicios.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/treino')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{workout.nome}</h1>
                <p className="text-sm text-muted-foreground">{workout.descricao}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Target className="h-3 w-3" />
                <span>{workout.exercicios.length} exercícios</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{workout.duracao_minutos}min</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progresso do Treino</span>
              <span className="text-sm text-muted-foreground">
                {currentExerciseIndex + 1} de {workout.exercicios.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-fitness-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Exercise */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentExercise.nome}</CardTitle>
                    <CardDescription className="text-base">
                      {currentExercise.musculo} • Série {currentSet} de {currentExercise.series}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {currentExercise.repeticoes} reps
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-500">{currentExercise.series}</div>
                    <div className="text-sm text-muted-foreground">Séries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-500">{currentExercise.repeticoes}</div>
                    <div className="text-sm text-muted-foreground">Repetições</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-500">{currentExercise.peso}kg</div>
                    <div className="text-sm text-muted-foreground">Peso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-500">{currentExercise.descanso}s</div>
                    <div className="text-sm text-muted-foreground">Descanso</div>
                  </div>
                </div>

                {/* Botões de Vídeo e Instruções */}
                <div className="flex gap-3 mb-6">
                  {currentExercise.video_url ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowVideoModal(true)}
                      className="flex items-center gap-2 hover:bg-fitness-50 hover:border-fitness-300"
                    >
                      <Video className="h-4 w-4" />
                      Ver Vídeo
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md border border-dashed">
                      <Video className="h-4 w-4" />
                      Sem Vídeo
                    </div>
                  )}
                  {currentExercise.instrucoes ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowInstructionsModal(true)}
                      className="flex items-center gap-2 hover:bg-fitness-50 hover:border-fitness-300"
                    >
                      <BookOpen className="h-4 w-4" />
                      Ver Instruções
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md border border-dashed">
                      <BookOpen className="h-4 w-4" />
                      Sem Instruções
                    </div>
                  )}
                </div>


                {/* Rest Timer */}
                {isResting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-muted rounded-lg p-6 text-center mb-6"
                  >
                    <Timer className="h-8 w-8 text-fitness-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-muted-foreground">Descanso em andamento...</p>
                  </motion.div>
                )}

                {/* Completed Sets */}
                {completedSets.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-foreground mb-2">Séries Concluídas:</h4>
                    <div className="flex space-x-2">
                      {completedSets.map((set, index) => (
                        <Badge key={index} variant="default" className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Série {set}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Saved Indicator */}
                {progressLoaded && (
                  <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center text-sm text-green-700 dark:text-green-300">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Progresso salvo automaticamente</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {!isRunning && !isResting && (
                    <Button onClick={startWorkout} size="lg" className="flex-1">
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar Treino
                    </Button>
                  )}

                  {isRunning && !isResting && (
                    <>
                      <Button onClick={pauseWorkout} variant="outline" size="lg">
                        <Pause className="h-5 w-5 mr-2" />
                        Pausar
                      </Button>
                      <Button onClick={completeSet} size="lg" className="flex-1">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Concluir Série
                      </Button>
                    </>
                  )}

                  {isResting && (
                    <div className="flex gap-3 w-full">
                      <Button onClick={skipRest} size="lg" className="flex-1">
                        <Play className="h-5 w-5 mr-2" />
                        Pular Descanso
                      </Button>
                      {isRestPaused ? (
                        <Button onClick={resumeRest} variant="outline" size="lg">
                          <Play className="h-5 w-5 mr-2" />
                          Retomar
                        </Button>
                      ) : (
                        <Button onClick={pauseRest} variant="outline" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Pausar
                        </Button>
                      )}
                    </div>
                  )}

                  <Button onClick={skipExercise} variant="outline" size="lg">
                    <SkipForward className="h-5 w-5 mr-2" />
                    Pular Exercício
                  </Button>

                  <Button onClick={resetWorkout} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Exercícios</CardTitle>
            <CardDescription>Sequência completa do treino</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercicios.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    index === currentExerciseIndex
                      ? 'border-fitness-500 bg-fitness-50 dark:bg-fitness-950/20'
                      : 'border-border bg-background'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentExerciseIndex
                        ? 'bg-green-500 text-white'
                        : index === currentExerciseIndex
                        ? 'bg-fitness-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentExerciseIndex ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{exercise.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exercise.series} séries × {exercise.repeticoes} reps • {exercise.peso}kg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {exercise.video_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentExerciseIndex(index)
                          setShowVideoModal(true)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    )}
                    {exercise.instrucoes && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentExerciseIndex(index)
                          setShowInstructionsModal(true)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge variant="outline">
                      {exercise.descanso}s
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Vídeo */}
        {showVideoModal && currentExercise.video_url && (
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
                  src={convertToEmbedUrl(currentExercise.video_url)}
                  title={`Vídeo do exercício ${currentExercise.nome}`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={(e) => {
                    console.error('Erro ao carregar vídeo:', e)
                    // Fallback: abrir em nova aba
                    window.open(currentExercise.video_url, '_blank')
                  }}
                />
              </div>
              <div className="mt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentExercise.video_url, '_blank')}
                  className="text-xs"
                >
                  Abrir no YouTube
                </Button>
              </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{currentExercise.nome}</h3>
                  <p className="text-muted-foreground">{currentExercise.musculo}</p>
                  {currentExercise.descricao && (
                    <p className="text-sm text-muted-foreground mt-2">{currentExercise.descricao}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Instruções */}
        {showInstructionsModal && currentExercise.instrucoes && (
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
                  <h3 className="text-lg font-semibold mb-2">{currentExercise.nome}</h3>
                  <p className="text-muted-foreground mb-4">{currentExercise.musculo}</p>
                  {currentExercise.descricao && (
                    <p className="text-sm text-muted-foreground mb-4">{currentExercise.descricao}</p>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentExercise.instrucoes}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

