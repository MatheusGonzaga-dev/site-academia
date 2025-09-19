'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  ChevronLeft,
  Target,
  Clock,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

interface Exercise {
  id: string
  nome: string
  descricao?: string
  instrucoes?: string
  musculo_id: string
  musculo_nome?: string
  equipamento?: string
  nivel_dificuldade?: 'iniciante' | 'intermediario' | 'avancado'
  video_url?: string
  imagem_url?: string
  ativo: boolean
}

interface Muscle {
  id: string
  nome: string
  descricao?: string
}

export default function ExerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [muscles, setMuscles] = useState<Muscle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    instrucoes: '',
    musculo_id: '',
    equipamento: '',
    nivel_dificuldade: 'iniciante' as 'iniciante' | 'intermediario' | 'avancado',
    video_url: '',
    imagem_url: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar músculos
      const { data: musclesData, error: musclesError } = await (supabase as any)
        .from('musculos')
        .select('*')
        .order('nome')

      if (musclesError) throw musclesError
      setMuscles(musclesData || [])

      // Carregar exercícios
      const { data: exercisesData, error: exercisesError } = await (supabase as any)
        .from('exercicios')
        .select(`
          *,
          musculos!inner(nome)
        `)
        .order('nome')

      if (exercisesError) throw exercisesError
      
      const formattedExercises = exercisesData?.map((ex: any) => ({
        ...ex,
        musculo_nome: ex.musculos?.nome
      })) || []
      
      setExercises(formattedExercises)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar exercícios')
    } finally {
      setLoading(false)
    }
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.nome.toLowerCase().includes(search.toLowerCase()) ||
                         exercise.descricao?.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = selectedMuscle === 'all' || exercise.musculo_id === selectedMuscle
    return matchesSearch && matchesMuscle && exercise.ativo
  })

  const handleSave = async () => {
    try {
      if (editingExercise) {
        // Atualizar
        const { error } = await (supabase as any)
          .from('exercicios')
          .update(formData)
          .eq('id', editingExercise.id)

        if (error) throw error
        toast.success('Exercício atualizado com sucesso!')
      } else {
        // Criar
        const { error } = await (supabase as any)
          .from('exercicios')
          .insert(formData)

        if (error) throw error
        toast.success('Exercício criado com sucesso!')
      }

      setShowForm(false)
      setEditingExercise(null)
      setFormData({
        nome: '',
        descricao: '',
        instrucoes: '',
        musculo_id: '',
        equipamento: '',
        nivel_dificuldade: 'iniciante',
        video_url: '',
        imagem_url: ''
      })
      loadData()
    } catch (error) {
      console.error('Erro ao salvar exercício:', error)
      toast.error('Erro ao salvar exercício')
    }
  }

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      nome: exercise.nome,
      descricao: exercise.descricao || '',
      instrucoes: exercise.instrucoes || '',
      musculo_id: exercise.musculo_id,
      equipamento: exercise.equipamento || '',
      nivel_dificuldade: exercise.nivel_dificuldade || 'iniciante',
      video_url: exercise.video_url || '',
      imagem_url: exercise.imagem_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este exercício?')) return

    try {
      const { error } = await (supabase as any)
        .from('exercicios')
        .update({ ativo: false })
        .eq('id', id)

      if (error) throw error
      toast.success('Exercício excluído com sucesso!')
      loadData()
    } catch (error) {
      console.error('Erro ao excluir exercício:', error)
      toast.error('Erro ao excluir exercício')
    }
  }

  const getDifficultyColor = (nivel: string) => {
    switch (nivel) {
      case 'iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'intermediario': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'avancado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exercícios</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu catálogo de exercícios
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Exercício
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar exercícios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos os músculos</option>
                {muscles.map(muscle => (
                  <option key={muscle.id} value={muscle.id}>
                    {muscle.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Exercícios */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{exercise.nome}</CardTitle>
                    <CardDescription className="mt-1">
                      {exercise.descricao}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(exercise)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exercise.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {exercise.musculo_nome}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(exercise.nivel_dificuldade || 'iniciante')}`}>
                    {exercise.nivel_dificuldade}
                  </Badge>
                  {exercise.equipamento && (
                    <Badge variant="secondary" className="text-xs">
                      {exercise.equipamento}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {exercise.instrucoes && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {exercise.instrucoes}
                  </p>
                )}
                <div className="flex gap-2">
                  {exercise.video_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">
                        <Zap className="mr-1 h-3 w-3" />
                        Vídeo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum exercício encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            {search || selectedMuscle !== 'all'
              ? 'Tente ajustar os filtros de busca.'
              : 'Crie seu primeiro exercício para começar!'
            }
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Exercício
          </Button>
        </motion.div>
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingExercise ? 'Editar Exercício' : 'Novo Exercício'}
              </CardTitle>
              <CardDescription>
                {editingExercise ? 'Atualize as informações do exercício' : 'Adicione um novo exercício ao catálogo'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome do exercício"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Músculo *</label>
                  <select
                    value={formData.musculo_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, musculo_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Selecione um músculo</option>
                    {muscles.map(muscle => (
                      <option key={muscle.id} value={muscle.id}>
                        {muscle.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Breve descrição do exercício"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Instruções</label>
                <textarea
                  value={formData.instrucoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, instrucoes: e.target.value }))}
                  placeholder="Instruções detalhadas de execução"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Equipamento</label>
                  <Input
                    value={formData.equipamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, equipamento: e.target.value }))}
                    placeholder="Ex: Halteres, Barra, Máquina"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nível de Dificuldade</label>
                  <select
                    value={formData.nivel_dificuldade}
                    onChange={(e) => setFormData(prev => ({ ...prev, nivel_dificuldade: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">URL do Vídeo</label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL da Imagem</label>
                  <Input
                    value={formData.imagem_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, imagem_url: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={!formData.nome || !formData.musculo_id}>
                  {editingExercise ? 'Atualizar' : 'Criar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingExercise(null)
                    setFormData({
                      nome: '',
                      descricao: '',
                      instrucoes: '',
                      musculo_id: '',
                      equipamento: '',
                      nivel_dificuldade: 'iniciante',
                      video_url: '',
                      imagem_url: ''
                    })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
