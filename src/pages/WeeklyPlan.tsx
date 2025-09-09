import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { WeeklyPlanEditor } from '@/components/WeeklyPlanEditor';
import { Calendar, Plus, Dumbbell, Edit } from 'lucide-react';
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
  const { 
    weeklyPlan, 
    workoutTemplates, 
    updateWeeklyPlan, 
    updateWeeklyPlanDay, 
    generateTodaysWorkout, 
    addWorkout
  } = useSupabaseStore();
  const [editingDay, setEditingDay] = useState<{ dayOfWeek: number; dayName: string; template: WorkoutTemplate | null } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const assignTemplateToDay = async (dayId: number, templateId: string) => {
    try {
      const template = workoutTemplates.find(t => t.id === templateId);
      if (!template) return;

      // Usar a função updateWeeklyPlanDay que já lida com o salvamento
      await updateWeeklyPlanDay(dayId, template);
      setEditingDay(null);
      setSelectedTemplate('');
      
      // Notificar sucesso
      const dayName = weekDays.find(d => d.id === dayId)?.name || 'Dia';
      alert(`✅ ${dayName} atualizado com ${template.name}!`);
    } catch (error) {
      console.error('❌ Erro ao atribuir template:', error);
      alert('❌ Erro ao salvar plano semanal. Tente novamente.');
    }
  };

  const removeWorkoutFromDay = async (dayId: number) => {
    try {
      // Usar a função updateWeeklyPlanDay para remover (passa null)
      await updateWeeklyPlanDay(dayId, null);
      
      // Notificar sucesso
      const dayName = weekDays.find(d => d.id === dayId)?.name || 'Dia';
      alert(`✅ Treino removido de ${dayName}!`);
    } catch (error) {
      console.error('❌ Erro ao remover treino:', error);
      alert('❌ Erro ao salvar alteração. Tente novamente.');
    }
  };

  const handleEditDay = (dayOfWeek: number, dayName: string) => {
    const template = weeklyPlan.schedule[dayOfWeek] || null;
    setEditingDay({ dayOfWeek, dayName, template });
  };

  // Função para notificar a página de treinos para gerar treinos
  const triggerWorkoutGeneration = () => {
    console.log('🎯 Disparando geração de treinos...');
    window.dispatchEvent(new CustomEvent('generateWeeklyWorkouts'));
  };

  const handleSaveDay = async (dayOfWeek: number, template: WorkoutTemplate | null) => {
    try {
      // Aguardar o salvamento no banco
      await updateWeeklyPlanDay(dayOfWeek, template);
      setEditingDay(null);
      
      // Mostrar feedback visual
      console.log(`Dia ${dayOfWeek} atualizado:`, template ? template.name : 'Descanso');
      
      // Notificar sucesso
      const dayName = weekDays.find(d => d.id === dayOfWeek)?.name || 'Dia';
      alert(`✅ ${dayName} atualizado com sucesso!`);
      
      // Disparar geração de treinos na página de treinos
      console.log('🎯 Disparando geração de treinos após atualização do plano...');
      triggerWorkoutGeneration();
    } catch (error) {
      console.error('❌ Erro ao salvar dia:', error);
      alert('❌ Erro ao salvar plano semanal. Verifique sua conexão com a internet e tente novamente.');
    }
  };

  const handleCloseEditor = () => {
    setEditingDay(null);
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
              const isEditing = editingDay?.dayOfWeek === day.id;

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
                        onClick={() => handleEditDay(day.id, day.name)}
                      >
                        <Edit className="h-4 w-4" />
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
                        {workout.description && (
                          <p className="text-sm text-gray-600 overflow-hidden" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                            hyphens: 'auto'
                          }}>
                            {workout.description}
                          </p>
                        )}
                        <Badge variant="secondary">
                          {Array.isArray(workout.muscleGroup) 
                            ? workout.muscleGroup.join(' + ') 
                            : workout.muscleGroup}
                        </Badge>
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
                          onClick={() => handleEditDay(day.id, day.name)}
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


      {/* Modal de Edição do Plano Semanal */}
      {editingDay && (
        <WeeklyPlanEditor
          dayOfWeek={editingDay.dayOfWeek}
          dayName={editingDay.dayName}
          template={editingDay.template}
          onSave={handleSaveDay}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
}
