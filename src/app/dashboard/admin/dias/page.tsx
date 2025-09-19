'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  ChevronLeft,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Database } from '@/types/database'

interface DiaTreino {
  id: string
  nome: string
  ordem_dia: number
  ativo: boolean
  criado_em: string
}

export default function DiasAdminPage() {
  const [dias, setDias] = useState<DiaTreino[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ nome: string; ordem_dia: number }>({ nome: '', ordem_dia: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDia, setNewDia] = useState<Database['public']['Tables']['dias_treino']['Insert']>({ nome: '', ordem_dia: 0 })

  useEffect(() => {
    loadDias()
  }, [])

  const loadDias = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('dias_treino')
        .select('*')
        .order('ordem_dia')

      if (error) throw error
      setDias(data || [])
    } catch (error) {
      console.error('Erro ao carregar dias:', error)
      toast.error('Erro ao carregar dias da semana')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (dia: DiaTreino) => {
    setEditingId(dia.id)
    setEditForm({
      nome: dia.nome,
      ordem_dia: dia.ordem_dia
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return

    try {
      const { error } = await (supabase as any)
        .from('dias_treino')
        .update({
          nome: editForm.nome,
          ordem_dia: editForm.ordem_dia
        })
        .eq('id', editingId)

      if (error) throw error
      
      toast.success('Dia atualizado com sucesso!')
      setEditingId(null)
      loadDias()
    } catch (error) {
      console.error('Erro ao atualizar dia:', error)
      toast.error('Erro ao atualizar dia')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ nome: '', ordem_dia: 0 })
  }

  const handleAdd = async () => {
    if (!newDia.nome.trim()) {
      toast.error('Nome do dia é obrigatório')
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('dias_treino')
        .insert(newDia)

      if (error) throw error
      
      toast.success('Dia adicionado com sucesso!')
      setNewDia({ nome: '', ordem_dia: 0 })
      setShowAddForm(false)
      loadDias()
    } catch (error) {
      console.error('Erro ao adicionar dia:', error)
      toast.error('Erro ao adicionar dia')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este dia? Isso pode afetar treinos existentes.')) return

    try {
      const { error } = await (supabase as any)
        .from('dias_treino')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      toast.success('Dia excluído com sucesso!')
      loadDias()
    } catch (error) {
      console.error('Erro ao excluir dia:', error)
      toast.error('Erro ao excluir dia')
    }
  }

  const moveDay = async (id: string, direction: 'up' | 'down') => {
    const currentDia = dias.find(d => d.id === id)
    if (!currentDia) return

    const newOrder = direction === 'up' ? currentDia.ordem_dia - 1 : currentDia.ordem_dia + 1
    const targetDia = dias.find(d => d.ordem_dia === newOrder)
    
    if (!targetDia) return

    try {
      // Trocar as ordens
      await (supabase as any)
        .from('dias_treino')
        .update({ ordem_dia: currentDia.ordem_dia })
        .eq('id', targetDia.id)

      await (supabase as any)
        .from('dias_treino')
        .update({ ordem_dia: newOrder })
        .eq('id', id)

      toast.success('Ordem atualizada!')
      loadDias()
    } catch (error) {
      console.error('Erro ao mover dia:', error)
      toast.error('Erro ao mover dia')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
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
            <h1 className="text-3xl font-bold text-foreground">Dias da Semana</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os dias da semana para os treinos
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Dia
        </Button>
      </div>

      {/* Lista de Dias */}
      <div className="space-y-4">
        {dias.map((dia, index) => (
          <motion.div
            key={dia.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDay(dia.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDay(dia.id, 'down')}
                        disabled={index === dias.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {dia.ordem_dia}
                      </Badge>
                      
                      {editingId === dia.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editForm.nome}
                            onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                            className="w-48"
                          />
                          <Input
                            type="number"
                            value={editForm.ordem_dia}
                            onChange={(e) => setEditForm(prev => ({ ...prev, ordem_dia: parseInt(e.target.value) || 0 }))}
                            className="w-20"
                            min="1"
                            max="7"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{dia.nome}</h3>
                          <p className="text-sm text-muted-foreground">
                            Ordem: {dia.ordem_dia}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === dia.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(dia)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(dia.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal de Adicionar */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Novo Dia da Semana</CardTitle>
              <CardDescription>
                Adicione um novo dia para organizar os treinos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome do Dia *</label>
                <Input
                  value={newDia.nome}
                  onChange={(e) => setNewDia(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Segunda-feira"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ordem *</label>
                <Input
                  type="number"
                  value={newDia.ordem_dia}
                  onChange={(e) => setNewDia(prev => ({ ...prev, ordem_dia: parseInt(e.target.value) || 0 }))}
                  placeholder="1-7"
                  min="1"
                  max="7"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleAdd} disabled={!newDia.nome.trim()}>
                  Adicionar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setNewDia({ nome: '', ordem_dia: 0 })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {dias.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum dia configurado
          </h3>
          <p className="text-muted-foreground mb-6">
            Configure os dias da semana para organizar seus treinos
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Dia
          </Button>
        </motion.div>
      )}
    </div>
  )
}
