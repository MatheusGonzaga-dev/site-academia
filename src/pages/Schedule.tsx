import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  Dumbbell
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Schedule() {
  const { workouts } = useSupabaseStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => isSameDay(workout.date, date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agenda de Treinos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie seus treinos programados
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agendar Treino
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map(day => {
                  const dayWorkouts = getWorkoutsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        p-2 min-h-[80px] border rounded cursor-pointer transition-colors
                        ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                        ${isTodayDate ? 'border-primary' : 'border-muted'}
                      `}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {dayWorkouts.slice(0, 2).map(workout => (
                          <div
                            key={workout.id}
                            className={`
                              text-xs p-1 rounded truncate
                              ${workout.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                              }
                            `}
                          >
                            {workout.name}
                          </div>
                        ))}
                        
                        {dayWorkouts.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayWorkouts.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Date Info */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
                <CardDescription>
                  {isToday(selectedDate) && "Hoje • "}
                  {format(selectedDate, "EEEE", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getWorkoutsForDate(selectedDate).map(workout => (
                    <div key={workout.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{workout.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {workout.exercises.length} exercícios
                            {workout.duration && (
                              <span className="ml-2 inline-flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {workout.duration}min
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant={workout.completed ? "default" : "secondary"}>
                        {workout.completed ? "Concluído" : "Pendente"}
                      </Badge>
                    </div>
                  ))}
                  
                  {getWorkoutsForDate(selectedDate).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum treino programado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Workouts */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Treinos</CardTitle>
              <CardDescription>
                Treinos programados para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workouts
                  .filter(workout => workout.date >= new Date() && !workout.completed)
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map(workout => (
                    <div key={workout.id} className="flex items-center space-x-3 p-2 border rounded">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-bold">
                          {format(workout.date, 'd')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(workout.date, 'MMM', { locale: ptBR })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercícios
                        </p>
                      </div>
                    </div>
                  ))}
                
                {workouts.filter(workout => workout.date >= new Date() && !workout.completed).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum treino programado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Treinos planejados</span>
                  <span className="font-medium">
                    {workouts.filter(w => {
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return w.date >= weekStart && w.date <= weekEnd;
                    }).length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Treinos concluídos</span>
                  <span className="font-medium">
                    {workouts.filter(w => {
                      const weekStart = new Date();
                      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return w.date >= weekStart && w.date <= weekEnd && w.completed;
                    }).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
