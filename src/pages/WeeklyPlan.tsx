import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { Calendar, Settings, Plus, Dumbbell } from 'lucide-react';
import { WeeklyWorkoutPlan, WorkoutTemplate } from '@/types';

const weekDays = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda-feira', short: 'Seg' },
  { id: 2, name: 'Terça-feira', short: 'Ter' },
  { id: 3, name: 'Quarta-feira', short: 'Qua' },
  { id: 4, name: 'Quinta-feira', short: 'Qui' },
  { id: 5, name: 'Sexta-feira', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' }
];

export function WeeklyPlan() {
  const { weeklyPlan, workoutTemplates, updateWeeklyPlan, generateTodaysWorkout, addWorkout } = useSupabaseStore();
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const assignTemplateToDay = (dayId: number, templateId: string) => {
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newPlan: WeeklyWorkoutPlan = {
      ...weeklyPlan,
      schedule: {
        ...weeklyPlan.schedule,
        [dayId]: template
      }
    };

    updateWeeklyPlan(newPlan);
    setEditingDay(null);
    setSelectedTemplate('');
  };

  const removeWorkoutFromDay = (dayId: number) => {
    const newSchedule = { ...weeklyPlan.schedule };
    delete newSchedule[dayId];

    const newPlan: WeeklyWorkoutPlan = {
      ...weeklyPlan,
      schedule: newSchedule
    };

    updateWeeklyPlan(newPlan);
  };

  const generateTodayWorkout = async () => {
    const workout = generateTodaysWorkout();
    if (workout) {
      await addWorkout(workout);
      alert(`Treino de hoje (${workout.name}) criado com sucesso!`);
    } else {
      alert('Hoje é dia de descanso! 😊');
    }
  };

  const getTodayDayId = () => new Date().getDay();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plano Semanal</h1>
          <p className="text-muted-foreground">
            Configure seus treinos por dia da semana
          </p>
        </div>
        <Button onClick={generateTodayWorkout}>
          <Plus className="mr-2 h-4 w-4" />
          Gerar Treino de Hoje
        </Button>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            {weeklyPlan.name}
          </CardTitle>
          <CardDescription>
            Seu cronograma de treinos semanal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weekDays.map(day => {
              const workout = weeklyPlan.schedule[day.id];
              const isToday = getTodayDayId() === day.id;
              const isEditing = editingDay === day.id;

              return (
                <Card key={day.id} className={`${isToday ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {day.name}
                        {isToday && <Badge className="ml-2">Hoje</Badge>}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDay(isEditing ? null : day.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-3">
                        <select
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Selecione um treino</option>
                          {workoutTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => selectedTemplate && assignTemplateToDay(day.id, selectedTemplate)}
                            disabled={!selectedTemplate}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingDay(null)}
                          >
                            Cancelar
                          </Button>
                          {workout && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeWorkoutFromDay(day.id)}
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : workout ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Dumbbell className="h-4 w-4 text-primary" />
                          <span className="font-medium">{workout.name}</span>
                        </div>
                        <Badge variant="secondary">{workout.muscleGroup}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercícios
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {workout.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                          {workout.exercises.length > 3 && '...'}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Dia de descanso</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => setEditingDay(day.id)}
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Adicionar Treino
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Available Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Templates Disponíveis</CardTitle>
          <CardDescription>
            Treinos pré-configurados que você pode usar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workoutTemplates.map(template => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline">{template.muscleGroup}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">{template.exercises.length} exercícios:</span>
                  </p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    {template.exercises.slice(0, 4).map(exercise => (
                      <li key={exercise.id}>• {exercise.name}</li>
                    ))}
                    {template.exercises.length > 4 && (
                      <li>• +{template.exercises.length - 4} mais exercícios</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
