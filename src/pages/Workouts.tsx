import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { WorkoutExecution } from '@/components/WorkoutExecution';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle,
  PlayCircle,
  Edit,
  Trash2,
  Dumbbell,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateUUID } from '@/lib/uuid';
import { Workout, Exercise, Set } from '@/types';

export function Workouts() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, loadWorkouts, loadWeeklyPlan, weeklyPlan } = useSupabaseStore();
  const getStore = useSupabaseStore.getState;
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [executingWorkout, setExecutingWorkout] = useState<Workout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay()); // Inicia com o dia atual

  // Função para gerar treinos da semana automaticamente
  const generateWeeklyWorkouts = async () => {
    // Evitar execução múltipla simultânea
    if (isGenerating) {
      console.log('Geração já em andamento, ignorando...');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // PRIMEIRO: Recarregar o plano semanal para garantir dados atualizados
      console.log('🔄 Recarregando plano semanal...');
      await loadWeeklyPlan();
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
      
      console.log('Iniciando geração de treinos...');
      
      // PRIMEIRO: Limpar todos os treinos da semana atual que são do plano semanal
      const currentWeekWorkouts = workouts.filter(w => 
        w.fromWeeklyPlan === true &&
        w.date >= startOfWeek &&
        w.date <= endOfWeek
      );
      
      console.log(`Removendo ${currentWeekWorkouts.length} treinos existentes...`);
      
      // Aguardar todas as deleções terminarem
      await Promise.all(currentWeekWorkouts.map(workout => deleteWorkout(workout.id)));
      
      // Aguardar um pouco para garantir que as deleções foram processadas
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Recarregar treinos para ter dados atualizados
      await loadWorkouts();
      
      // SEGUNDO: Gerar treinos apenas para os 7 dias da semana atual
      let generatedCount = 0;
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        const dayOfWeek = currentDate.getDay();
        
        // Verificar se este dia tem treino no plano semanal
        const plan = getStore().weeklyPlan; // Usar o estado mais atual
        const dayKey = dayOfWeek.toString();
        const template = (plan.schedule as any)[dayKey]; // Converter para string
        
        console.log(`📋 Verificando dia ${dayOfWeek}:`, {
          planId: plan.id,
          planName: plan.name,
          temTemplate: !!template,
          nomeTemplate: template?.name,
          exerciciosTemplate: template?.exercises?.length || 0,
          scheduleKeys: Object.keys(plan.schedule),
          chaveUsada: dayKey,
          templateEncontrado: template
        });
        
        // Só gerar treino se o dia não for de descanso (template existe)
        if (template) {
          console.log(`🎯 Gerando treino para dia ${dayOfWeek}:`, {
            nome: template.name,
            exercicios: template.exercises?.length || 0,
            detalhes: template.exercises?.map((ex: any) => ex.name) || []
          });
          
          const workout: Workout = {
            id: generateUUID(),
            name: template.name,
            date: currentDate,
            completed: false,
            fromWeeklyPlan: true,
            exercises: template.exercises?.map((exercise: any) => ({
              ...exercise,
              sets: [
                { id: generateUUID(), reps: 12, completed: false },
                { id: generateUUID(), reps: 10, completed: false },
                { id: generateUUID(), reps: 8, completed: false }
              ]
            })) || []
          };
          
          await addWorkout(workout);
          generatedCount++;
          console.log(`✅ Gerado: ${template.name} para ${format(currentDate, 'dd/MM/yyyy')} com ${workout.exercises.length} exercícios`);
        }
        // Se template não existe, é dia de descanso - não gerar treino
      }
      
      console.log(`🎉 Geração concluída! ${generatedCount} treinos criados.`);
      
      // Notificar outras páginas sobre a atualização
      window.dispatchEvent(new CustomEvent('workoutsUpdated'));
      console.log('📢 Evento de atualização disparado');
    } catch (error) {
      console.error('❌ Erro ao gerar treinos:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para limpar todos os treinos da semana atual e regenerar
  const resetWeeklyWorkouts = async () => {
    // Carregar plano semanal atualizado primeiro
    await loadWeeklyPlan();
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // Encontrar todos os treinos da semana atual
    const weeklyWorkouts = workouts.filter(w => 
      w.fromWeeklyPlan === true &&
      w.date >= startOfWeek &&
      w.date <= endOfWeek
    );
    
    // Deletar todos os treinos da semana atual
    for (const workout of weeklyWorkouts) {
      await deleteWorkout(workout.id);
    }
    
    // Regenerar treinos baseados no plano semanal atualizado
    await generateWeeklyWorkouts();
  };

  // Carregar dados iniciais e verificar se precisa gerar treinos
  useEffect(() => {
    const loadInitialData = async () => {
      await loadWeeklyPlan();
      await loadWorkouts();
      
      // Verificar se temos treinos para a semana atual
      setTimeout(() => {
        checkAndGenerateWeeklyWorkouts();
      }, 1000); // Aguardar um pouco para os dados carregarem
    };
    loadInitialData();
  }, [loadWorkouts, loadWeeklyPlan]);

  // Função para verificar se precisamos gerar treinos para a semana atual
  const checkAndGenerateWeeklyWorkouts = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // Contar quantos treinos temos para esta semana
    const currentWeekWorkouts = workouts.filter(w => 
      w.fromWeeklyPlan === true &&
      w.date >= startOfWeek &&
      w.date <= endOfWeek
    );
    
    // Contar quantos dias de treino deveríamos ter baseado no plano semanal
    const expectedWorkouts = Object.keys(weeklyPlan.schedule || {}).length;
    
    console.log(`📊 Treinos da semana: ${currentWeekWorkouts.length}/${expectedWorkouts} esperados`);
    
    // Se não temos treinos suficientes, gerar automaticamente
    if (expectedWorkouts > 0 && currentWeekWorkouts.length < expectedWorkouts) {
      console.log('🎯 Gerando treinos automaticamente...');
      generateWeeklyWorkouts();
    }
  };

  // Escutar eventos de atualização de treinos de outras páginas
  useEffect(() => {
    const handleWorkoutsUpdate = () => {
      console.log('📢 Evento de atualização recebido, recarregando treinos...');
      loadWorkouts();
    };

    const handleGenerateWorkouts = () => {
      console.log('🎯 Evento de geração recebido, executando geração...');
      generateWeeklyWorkouts();
    };

    window.addEventListener('workoutsUpdated', handleWorkoutsUpdate);
    window.addEventListener('generateWeeklyWorkouts', handleGenerateWorkouts);
    
    return () => {
      window.removeEventListener('workoutsUpdated', handleWorkoutsUpdate);
      window.removeEventListener('generateWeeklyWorkouts', handleGenerateWorkouts);
    };
  }, [loadWorkouts, generateWeeklyWorkouts]);

  // DESABILITADO: Geração automática agora acontece apenas na página do plano semanal
  // useEffect(() => {
  //   if (weeklyPlan && weeklyPlan.id && Object.keys(weeklyPlan.schedule).length > 0) {
  //     console.log('🎯 Plano semanal detectado, gerando treinos...');
  //     generateWeeklyWorkouts();
  //   }
  // }, [weeklyPlan.schedule]); // Monitora mudanças no schedule

  // Filtrar apenas treinos criados pelo plano semanal da semana atual
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
  
  const weeklyPlanWorkouts = workouts.filter(workout => 
    workout.fromWeeklyPlan === true &&
    workout.date >= startOfWeek &&
    workout.date <= endOfWeek
  );

  // Filtrar treinos do dia selecionado
  const selectedDayDate = new Date(startOfWeek);
  selectedDayDate.setDate(startOfWeek.getDate() + selectedDay);
  
  const selectedDayWorkouts = weeklyPlanWorkouts.filter(workout => 
    workout.date.toDateString() === selectedDayDate.toDateString()
  );
  
  const filteredWorkouts = selectedDayWorkouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Debug logs
  console.log('📊 Treinos:', {
    total: workouts.length,
    semana: weeklyPlanWorkouts.length,
    diaSelecionado: selectedDay,
    treinosDoDia: selectedDayWorkouts.length,
    filtrados: filteredWorkouts.length
  });

  const createNewWorkout = () => {
    // Criar treino avulso (não do plano semanal)
    const newWorkout: Workout = {
      id: generateUUID(),
      name: 'Novo Treino',
      date: new Date(),
      exercises: [],
      completed: false,
      fromWeeklyPlan: false // marca como treino avulso
    };
    
    addWorkout(newWorkout);
    setEditingWorkout(newWorkout);
  };


  const startWorkout = (workout: Workout) => {
    setExecutingWorkout(workout);
  };

  const handleWorkoutUpdate = (updatedWorkout: Workout) => {
    updateWorkout(updatedWorkout.id, updatedWorkout);
  };

  const handleWorkoutComplete = (completedWorkout: Workout) => {
    updateWorkout(completedWorkout.id, completedWorkout);
    // NÃO fechar o modal aqui - deixar o relatório aparecer
    // O modal só será fechado quando o usuário clicar em "Finalizar" no relatório
  };

  const closeWorkoutExecution = () => {
    setExecutingWorkout(null);
  };

  const addExerciseToWorkout = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const newExercise: Exercise = {
      id: generateUUID(),
      name: 'Novo Exercício',
      targetMuscle: 'Peito',
      sets: [{
        id: generateUUID(),
        reps: 12,
        completed: false
      }]
    };

    updateWorkout(workoutId, {
      exercises: [...workout.exercises, newExercise]
    });
  };

  const updateExercise = (workoutId: string, exerciseId: string, updates: Partial<Exercise>) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, ...updates } : ex
    );

    updateWorkout(workoutId, { exercises: updatedExercises });
  };

  const addSetToExercise = (workoutId: string, exerciseId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const exercise = workout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const newSet: Set = {
      id: generateUUID(),
      reps: 12,
      completed: false
    };

    updateExercise(workoutId, exerciseId, {
      sets: [...exercise.sets, newSet]
    });
  };

  const updateSet = (workoutId: string, exerciseId: string, setId: string, updates: Partial<Set>) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const exercise = workout.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const updatedSets = exercise.sets.map(set =>
      set.id === setId ? { ...set, ...updates } : set
    );

    updateExercise(workoutId, exerciseId, { sets: updatedSets });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Treinos</h1>
          <p className="text-muted-foreground">
            Gerencie seus treinos e acompanhe seu progresso
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={resetWeeklyWorkouts} variant="outline" disabled={isGenerating}>
            <Dumbbell className="mr-2 h-4 w-4" />
            {isGenerating ? 'Gerando...' : 'Atualizar Semana'}
          </Button>
          <Button onClick={createNewWorkout} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Novo Treino
          </Button>
        </div>
      </div>

      {/* Weekly Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Dumbbell className="mr-2 h-5 w-5" />
            Treinos desta Semana
          </CardTitle>
          <CardDescription>
            Seu cronograma de treinos baseado no plano semanal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-7">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dayName, dayIndex) => {
              const dayDate = new Date(startOfWeek);
              dayDate.setDate(startOfWeek.getDate() + dayIndex);
              const isToday = dayDate.toDateString() === today.toDateString();
              
              const plannedWorkout = weeklyPlan.schedule?.[dayIndex];
              const actualWorkout = weeklyPlanWorkouts.find(w => 
                w.date.toDateString() === dayDate.toDateString()
              );
              
              return (
                <div 
                  key={dayIndex} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedDay === dayIndex 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isToday 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedDay(dayIndex);
                    // Se há um treino e não está completo, iniciar automaticamente
                    if (actualWorkout && !actualWorkout.completed) {
                      setTimeout(() => startWorkout(actualWorkout), 100);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      selectedDay === dayIndex 
                        ? 'text-primary-foreground' 
                        : isToday ? 'text-primary' : ''
                    }`}>
                      {dayName}
                    </div>
                    <div className={`text-xs mb-2 ${
                      selectedDay === dayIndex 
                        ? 'text-primary-foreground/80' 
                        : 'text-muted-foreground'
                    }`}>
                      {format(dayDate, 'dd/MM')}
                    </div>
                    
                    {plannedWorkout ? (
                      <div className="space-y-1">
                        <div className={`text-xs font-medium ${
                          selectedDay === dayIndex 
                            ? 'text-primary-foreground' 
                            : 'text-green-600'
                        }`}>
                          {plannedWorkout.name}
                        </div>
                        <div className={`text-xs ${
                          selectedDay === dayIndex 
                            ? 'text-primary-foreground/80' 
                            : 'text-muted-foreground'
                        }`}>
                          {Array.isArray(plannedWorkout.muscleGroup) 
                            ? plannedWorkout.muscleGroup.join(' + ') 
                            : plannedWorkout.muscleGroup}
                        </div>
                        {actualWorkout ? (
                          <Badge 
                            variant={actualWorkout.completed ? "default" : "secondary"} 
                            className={`text-xs ${
                              selectedDay === dayIndex 
                                ? actualWorkout.completed 
                                  ? 'bg-primary-foreground text-primary' 
                                  : 'bg-primary-foreground/20 text-primary-foreground'
                                : ''
                            }`}
                          >
                            {actualWorkout.completed ? "✓" : "○"}
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              selectedDay === dayIndex 
                                ? 'border-primary-foreground/50 text-primary-foreground' 
                                : ''
                            }`}
                          >
                            Aguardando
                          </Badge>
                        )}
                        {actualWorkout && !actualWorkout.completed && selectedDay === dayIndex && (
                          <div className="text-xs text-primary-foreground/80 font-medium">
                            Clique para iniciar
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`text-xs ${
                        selectedDay === dayIndex 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        Descanso
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar treinos ou exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Treinos Detalhados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Treinos de {['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][selectedDay]}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map(workout => (
          <Card key={workout.id} id={`workout-${workout.id}`} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5" />
                  {workout.name}
                </CardTitle>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingWorkout(workout)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteWorkout(workout.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {format(workout.date, "dd/MM/yyyy", { locale: ptBR })}
                {workout.duration && (
                  <span className="ml-2 inline-flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {workout.duration}min
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {workout.exercises.length} exercícios
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={workout.completed ? "default" : "secondary"}>
                      {workout.completed ? "Concluído" : "Pendente"}
                    </Badge>
                    {workout.completed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateWorkout(workout.id, { completed: false })}
                        title="Marcar como pendente"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={workout.completed ? "secondary" : "default"}
                    onClick={() => workout.completed ? null : startWorkout(workout)}
                    className="flex-1"
                    disabled={workout.completed}
                  >
                    {workout.completed ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Iniciar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {filteredWorkouts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {searchTerm 
                ? 'Nenhum treino encontrado' 
                : weeklyPlan.schedule?.[selectedDay]
                  ? 'Treino ainda não foi gerado'
                  : 'Dia de descanso'
              }
            </p>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Tente buscar com outros termos' 
                : weeklyPlan.schedule?.[selectedDay]
                  ? 'O treino será gerado automaticamente em alguns segundos...'
                  : `Hoje é dia de descanso! Selecione outro dia para ver os treinos.`
              }
            </p>
            {!searchTerm && !weeklyPlan.schedule?.[selectedDay] && (
              <div className="space-x-2">
                <Button onClick={createNewWorkout} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Treino Avulso
                </Button>
                <Button onClick={() => window.location.href = '/weekly-plan'}>
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Configurar Plano Semanal
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Workout Modal/Form */}
      {editingWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Treino</CardTitle>
              <CardDescription>
                Configure os exercícios e séries do seu treino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nome do Treino</label>
                  <Input
                    value={editingWorkout.name}
                    onChange={(e) => setEditingWorkout({
                      ...editingWorkout,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={format(editingWorkout.date, 'yyyy-MM-dd')}
                    onChange={(e) => setEditingWorkout({
                      ...editingWorkout,
                      date: new Date(e.target.value)
                    })}
                  />
                </div>
              </div>

              {/* Exercises */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Exercícios</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addExerciseToWorkout(editingWorkout.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Exercício
                  </Button>
                </div>

                <div className="space-y-4">
                  {editingWorkout.exercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardHeader className="pb-4">
                        <div className="grid gap-2 md:grid-cols-2">
                          <Input
                            placeholder="Nome do exercício"
                            value={exercise.name}
                            onChange={(e) => updateExercise(editingWorkout.id, exercise.id, {
                              name: e.target.value
                            })}
                          />
                          <Input
                            placeholder="Músculo alvo"
                            value={exercise.targetMuscle}
                            onChange={(e) => updateExercise(editingWorkout.id, exercise.id, {
                              targetMuscle: e.target.value
                            })}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                            <span>Série</span>
                            <span>Reps</span>
                            <span>Peso (kg)</span>
                            <span>✓</span>
                          </div>
                          
                          {exercise.sets.map((set, setIndex) => (
                            <div key={set.id} className="grid grid-cols-4 gap-2">
                              <span className="flex items-center">{setIndex + 1}</span>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateSet(
                                  editingWorkout.id, 
                                  exercise.id, 
                                  set.id, 
                                  { reps: parseInt(e.target.value) || 0 }
                                )}
                              />
                              <Button
                                variant={set.completed ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateSet(
                                  editingWorkout.id, 
                                  exercise.id, 
                                  set.id, 
                                  { completed: !set.completed }
                                )}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addSetToExercise(editingWorkout.id, exercise.id)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar Série
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  placeholder="Adicione observações sobre o treino..."
                  value={editingWorkout.notes || ''}
                  onChange={(e) => setEditingWorkout({
                    ...editingWorkout,
                    notes: e.target.value
                  })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingWorkout(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={() => {
                  updateWorkout(editingWorkout.id, editingWorkout);
                  setEditingWorkout(null);
                }}>
                  Salvar Treino
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Execução do Treino */}
      {executingWorkout && (
        <WorkoutExecution
          workout={executingWorkout}
          onClose={closeWorkoutExecution}
          onComplete={handleWorkoutComplete}
          onUpdate={handleWorkoutUpdate}
        />
      )}
    </div>
  );
}
