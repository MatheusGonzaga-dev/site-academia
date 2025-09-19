'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Apple, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  Target,
  Calendar,
  CheckCircle,
  MoreVertical,
  Filter,
  Flame,
  Zap,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'
import { formatDate, formatCalories, formatMacros } from '@/lib/utils'

interface Meal {
  id: string
  nome: string
  descricao: string
  ordem_refeicao: number
  produtos: Product[]
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
}

interface Product {
  id: string
  nome: string
  marca: string
  quantidade_g: number
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
}

const refeicoes = [
  { id: 1, nome: 'Café da manhã', ordem: 1, icon: '🌅' },
  { id: 2, nome: 'Lanche da manhã', ordem: 2, icon: '🍎' },
  { id: 3, nome: 'Almoço', ordem: 3, icon: '🍽️' },
  { id: 4, nome: 'Lanche da tarde', ordem: 4, icon: '🥜' },
  { id: 5, nome: 'Jantar', ordem: 5, icon: '🌙' },
  { id: 6, nome: 'Ceia', ordem: 6, icon: '🌃' },
]

export default function DietaPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyStats, setDailyStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    goalCalories: 2200,
    goalProtein: 150,
    goalCarbs: 250,
    goalFat: 80
  })
  // supabase já está importado

  useEffect(() => {
    loadMeals()
  }, [selectedDate])

  const loadMeals = async () => {
    try {
      // Simular dados por enquanto
      const mockMeals: Meal[] = [
        {
          id: '1',
          nome: 'Café da manhã',
          descricao: 'Refeição matinal',
          ordem_refeicao: 1,
          produtos: [
            { id: '1', nome: 'Aveia', marca: 'Quaker', quantidade_g: 50, calorias: 190, proteinas: 7, carboidratos: 34, gorduras: 3 },
            { id: '2', nome: 'Banana', marca: '', quantidade_g: 100, calorias: 89, proteinas: 1, carboidratos: 23, gorduras: 0 },
            { id: '3', nome: 'Leite Desnatado', marca: 'Nestlé', quantidade_g: 200, calorias: 70, proteinas: 7, carboidratos: 10, gorduras: 0 }
          ],
          calorias: 349,
          proteinas: 15,
          carboidratos: 67,
          gorduras: 3
        },
        {
          id: '2',
          nome: 'Lanche da manhã',
          descricao: 'Lanche pré-treino',
          ordem_refeicao: 2,
          produtos: [
            { id: '4', nome: 'Whey Protein', marca: 'Growth', quantidade_g: 30, calorias: 120, proteinas: 24, carboidratos: 2, gorduras: 1 }
          ],
          calorias: 120,
          proteinas: 24,
          carboidratos: 2,
          gorduras: 1
        },
        {
          id: '3',
          nome: 'Almoço',
          descricao: 'Refeição principal',
          ordem_refeicao: 3,
          produtos: [
            { id: '5', nome: 'Frango Grelhado', marca: '', quantidade_g: 150, calorias: 250, proteinas: 46, carboidratos: 0, gorduras: 5 },
            { id: '6', nome: 'Arroz Integral', marca: '', quantidade_g: 100, calorias: 110, proteinas: 2, carboidratos: 23, gorduras: 1 },
            { id: '7', nome: 'Brócolis', marca: '', quantidade_g: 100, calorias: 34, proteinas: 3, carboidratos: 7, gorduras: 0 }
          ],
          calorias: 394,
          proteinas: 51,
          carboidratos: 30,
          gorduras: 6
        },
        {
          id: '4',
          nome: 'Lanche da tarde',
          descricao: 'Lanche pós-treino',
          ordem_refeicao: 4,
          produtos: [
            { id: '8', nome: 'Iogurte Grego', marca: 'Vigor', quantidade_g: 150, calorias: 130, proteinas: 15, carboidratos: 6, gorduras: 4 }
          ],
          calorias: 130,
          proteinas: 15,
          carboidratos: 6,
          gorduras: 4
        }
      ]

      setMeals(mockMeals)
      
      // Calcular estatísticas diárias
      const totalCalories = mockMeals.reduce((sum, meal) => sum + meal.calorias, 0)
      const totalProtein = mockMeals.reduce((sum, meal) => sum + meal.proteinas, 0)
      const totalCarbs = mockMeals.reduce((sum, meal) => sum + meal.carboidratos, 0)
      const totalFat = mockMeals.reduce((sum, meal) => sum + meal.gorduras, 0)
      
      setDailyStats(prev => ({
        ...prev,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat
      }))
    } catch (error) {
      console.error('Erro ao carregar refeições:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMealIcon = (ordem: number) => {
    const meal = refeicoes.find(r => r.ordem === ordem)
    return meal?.icon || '🍽️'
  }

  const getMealName = (ordem: number) => {
    const meal = refeicoes.find(r => r.ordem === ordem)
    return meal?.nome || 'Refeição'
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
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
          <h1 className="text-3xl font-bold text-gray-900">Minha Dieta</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe suas refeições e macronutrientes
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button asChild>
            <Link href="/dashboard/dieta/registrar">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Refeição
            </Link>
          </Button>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias</CardTitle>
              <Flame className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCalories(dailyStats.totalCalories)}
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: {formatCalories(dailyStats.goalCalories)}
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(dailyStats.totalCalories, dailyStats.goalCalories)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proteínas</CardTitle>
              <Zap className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMacros(dailyStats.totalProtein)}g
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: {formatMacros(dailyStats.goalProtein)}g
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(dailyStats.totalProtein, dailyStats.goalProtein)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMacros(dailyStats.totalCarbs)}g
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: {formatMacros(dailyStats.goalCarbs)}g
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(dailyStats.totalCarbs, dailyStats.goalCarbs)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gorduras</CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMacros(dailyStats.totalFat)}g
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: {formatMacros(dailyStats.goalFat)}g
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(dailyStats.totalFat, dailyStats.goalFat)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {refeicoes.map((refeicao, index) => {
          const meal = meals.find(m => m.ordem_refeicao === refeicao.ordem)
          
          return (
            <motion.div
              key={refeicao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{refeicao.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{refeicao.nome}</CardTitle>
                        <CardDescription>
                          {meal ? `${meal.produtos.length} produtos • ${formatCalories(meal.calorias)} calorias` : 'Nenhum produto registrado'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meal && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Registrado
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {meal && (
                  <CardContent>
                    <div className="space-y-4">
                      {/* Macronutrients */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-orange-600">
                            {formatCalories(meal.calorias)}
                          </div>
                          <div className="text-xs text-gray-600">Calorias</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">
                            {formatMacros(meal.proteinas)}g
                          </div>
                          <div className="text-xs text-gray-600">Proteínas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-blue-600">
                            {formatMacros(meal.carboidratos)}g
                          </div>
                          <div className="text-xs text-gray-600">Carboidratos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">
                            {formatMacros(meal.gorduras)}g
                          </div>
                          <div className="text-xs text-gray-600">Gorduras</div>
                        </div>
                      </div>
                      
                      {/* Products */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Produtos:</h4>
                        <div className="space-y-2">
                          {meal.produtos.map((produto) => (
                            <div key={produto.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{produto.nome}</div>
                                {produto.marca && (
                                  <div className="text-sm text-gray-600">{produto.marca}</div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {produto.quantidade_g}g
                                </div>
                                <div className="text-xs text-gray-600">
                                  {formatCalories(produto.calorias)} cal
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/dashboard/dieta/${meal.id}/editar`}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
                
                {!meal && (
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">
                        Nenhum produto registrado para esta refeição
                      </p>
                      <Button asChild size="sm">
                        <Link href={`/dashboard/dieta/registrar?refeicao=${refeicao.ordem}`}>
                          <Plus className="mr-2 h-4 w-4" />
                          Registrar Refeição
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {meals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-12"
        >
          <Apple className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma refeição registrada hoje
          </h3>
          <p className="text-gray-600 mb-6">
            Comece registrando suas refeições para acompanhar sua dieta
          </p>
          <Button asChild>
            <Link href="/dashboard/dieta/registrar">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Primeira Refeição
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  )
}
