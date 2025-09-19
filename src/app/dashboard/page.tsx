'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Apple, 
  Calendar, 
  TrendingUp, 
  Target, 
  Clock,
  Plus,
  Play,
  CheckCircle,
  Flame,
  Heart,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/components/providers'
import { supabase } from '@/lib/supabase-client'
import { formatDate, getWeekDates, getDayName } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    totalWorkouts: 0,
    caloriesToday: 0,
    mealsToday: 0,
    currentStreak: 0,
    weeklyGoal: 5
  })
  const [todayWorkout, setTodayWorkout] = useState<any>(null)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // supabase já está importado

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas básicas
      const today = new Date()
      const weekDates = getWeekDates(today)
      
      // Simular dados por enquanto (depois será substituído por queries reais)
      setStats({
        workoutsThisWeek: 3,
        totalWorkouts: 45,
        caloriesToday: 1850,
        mealsToday: 4,
        currentStreak: 7,
        weeklyGoal: 5
      })

      // Simular treino de hoje
      setTodayWorkout({
        id: '1',
        name: 'Peito e Tríceps',
        duration: 60,
        exercises: 8,
        completed: false
      })

      // Simular atividades recentes
      setRecentActivities([
        {
          id: '1',
          type: 'workout',
          title: 'Treino de Costas',
          time: '2 horas atrás',
          status: 'completed'
        },
        {
          id: '2',
          type: 'meal',
          title: 'Almoço registrado',
          time: '4 horas atrás',
          status: 'completed'
        },
        {
          id: '3',
          type: 'goal',
          title: 'Meta semanal atingida!',
          time: 'Ontem',
          status: 'achieved'
        }
      ])

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Iniciar Treino',
      description: 'Começar treino de hoje',
      icon: Play,
      href: '/dashboard/treino',
      color: 'fitness',
      disabled: !todayWorkout
    },
    {
      title: 'Registrar Refeição',
      description: 'Adicionar refeição',
      icon: Apple,
      href: '/dashboard/dieta',
      color: 'nutrition'
    },
    {
      title: 'Ver Progresso',
      description: 'Acompanhar evolução',
      icon: TrendingUp,
      href: '/dashboard/progresso',
      color: 'info'
    },
    {
      title: 'Planejar Semana',
      description: 'Organizar treinos',
      icon: Calendar,
      href: '/dashboard/planejamento',
      color: 'warning'
    }
  ]

  const weekDays = getWeekDates(new Date())

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Olá, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {formatDate(new Date())} • Vamos continuar sua jornada fitness
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treinos Esta Semana</CardTitle>
              <Dumbbell className="h-4 w-4 text-fitness-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.workoutsThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                de {stats.weeklyGoal} treinos planejados
              </p>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-fitness-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.workoutsThisWeek / stats.weeklyGoal) * 100}%` }}
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
              <CardTitle className="text-sm font-medium">Calorias Hoje</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.caloriesToday.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Meta: 2.200 calorias
              </p>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.caloriesToday / 2200) * 100}%` }}
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
              <CardTitle className="text-sm font-medium">Sequência Atual</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                dias consecutivos
              </p>
              <Badge variant="warning" className="mt-2">
                🔥 Em chamas!
              </Badge>
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
              <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">
                treinos realizados
              </p>
              <Badge variant="success" className="mt-2">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12% este mês
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Today's Workout */}
      {todayWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-fitness-200/30 bg-gradient-to-r from-fitness-950/20 to-fitness-900/10 dark:from-fitness-900/30 dark:to-fitness-800/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Treino de Hoje</CardTitle>
                  <CardDescription>
                    {todayWorkout.name} • {todayWorkout.duration}min • {todayWorkout.exercises} exercícios
                  </CardDescription>
                </div>
                <Badge variant={todayWorkout.completed ? "success" : "fitness"}>
                  {todayWorkout.completed ? (
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
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard/treino">
                    <Play className="mr-2 h-4 w-4" />
                    {todayWorkout.completed ? 'Ver Detalhes' : 'Iniciar Treino'}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/treino/editar">
                    Editar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <Card className={`card-hover ${action.disabled ? 'opacity-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                      <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full mt-4"
                    disabled={action.disabled}
                  >
                    <Link href={action.href}>
                      {action.disabled ? 'Indisponível' : 'Acessar'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Esta Semana</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {getDayName(day).slice(0, 3)}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-2">
                    {day.getDate()}
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    {index < 3 ? (
                      <Badge variant="success" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Feito
                      </Badge>
                    ) : index === 3 ? (
                      <Badge variant="fitness" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        Hoje
                      </Badge>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Atividades Recentes</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'workout' ? 'bg-fitness-100 dark:bg-fitness-900/30' :
                    activity.type === 'meal' ? 'bg-nutrition-100 dark:bg-nutrition-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {activity.type === 'workout' ? (
                      <Dumbbell className="h-4 w-4 text-fitness-600" />
                    ) : activity.type === 'meal' ? (
                      <Apple className="h-4 w-4 text-nutrition-600" />
                    ) : (
                      <Target className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'success' : 'info'}>
                    {activity.status === 'completed' ? 'Concluído' : 'Atingido'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
