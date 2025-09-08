import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Utensils,
  Dumbbell,
  Plus
} from 'lucide-react';
import { format, isToday, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Dashboard() {
  const { workouts, dietEntries, progressEntries } = useSupabaseStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const todayWorkouts = workouts.filter(workout => isToday(workout.date));
  const weekWorkouts = workouts.filter(workout => isThisWeek(workout.date));
  const completedThisWeek = weekWorkouts.filter(workout => workout.completed).length;
  
  const todayDiet = dietEntries.find(entry => isToday(entry.date));
  const lastProgress = progressEntries.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

  const totalCalories = todayDiet ? 
    Object.values(todayDiet.meals).flat().reduce((sum, meal) => sum + meal.calories, 0) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{greeting}, Matheus! 💪</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Treino
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treinos Esta Semana</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisWeek}/{weekWorkouts.length}</div>
            <p className="text-xs text-muted-foreground">
              {weekWorkouts.length > 0 ? 
                `${Math.round((completedThisWeek/weekWorkouts.length) * 100)}% concluído` : 
                'Nenhum treino planejado'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calorias Hoje</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Meta: 2.500 kcal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastProgress?.weight ? `${lastProgress.weight}kg` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastProgress ? 
                format(lastProgress.date, "dd/MM", { locale: ptBR }) : 
                'Sem registros'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Água Hoje</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayDiet ? `${(todayDiet.waterIntake / 1000).toFixed(1)}L` : '0L'}
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 3.0L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Treinos de Hoje
            </CardTitle>
            <CardDescription>
              Seus treinos programados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayWorkouts.length > 0 ? (
              <div className="space-y-3">
                {todayWorkouts.map(workout => (
                  <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercícios
                        </p>
                      </div>
                    </div>
                    <Badge variant={workout.completed ? "default" : "secondary"}>
                      {workout.completed ? "Concluído" : "Pendente"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                Nenhum treino programado para hoje
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Dieta de Hoje
            </CardTitle>
            <CardDescription>
              Resumo nutricional do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayDiet ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {Object.values(todayDiet.meals).flat()
                        .reduce((sum, meal) => sum + meal.protein, 0).toFixed(0)}g
                    </p>
                    <p className="text-sm text-muted-foreground">Proteína</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {Object.values(todayDiet.meals).flat()
                        .reduce((sum, meal) => sum + meal.carbs, 0).toFixed(0)}g
                    </p>
                    <p className="text-sm text-muted-foreground">Carboidratos</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {Object.values(todayDiet.meals).flat()
                      .reduce((sum, meal) => sum + meal.fats, 0).toFixed(0)}g
                  </p>
                  <p className="text-sm text-muted-foreground">Gorduras</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">
                Nenhuma refeição registrada hoje
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
