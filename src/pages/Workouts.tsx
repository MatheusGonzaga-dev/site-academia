import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle,
  PlayCircle,
  Edit,
  Trash2,
  Dumbbell,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { generateUUID } from '@/lib/uuid';
import { Workout, Exercise, Set } from '@/types';

export function Workouts() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout, generateTodaysWorkout } = useSupabaseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createNewWorkout = () => {
    const newWorkout: Workout = {
      id: generateUUID(),
      name: 'Novo Treino',
      date: new Date(),
      exercises: [],
      completed: false
    };
    
    addWorkout(newWorkout);
    setEditingWorkout(newWorkout);
    setShowCreateForm(true);
  };

  const createTodaysWorkout = async () => {
    const workout = generateTodaysWorkout();
    if (workout) {
      await addWorkout(workout);
      alert(`Treino de hoje (${workout.name}) criado com sucesso!`);
    } else {
      alert('Hoje é dia de descanso no seu plano semanal! 😊');
    }
  };

  const toggleWorkoutCompletion = (workout: Workout) => {
    updateWorkout(workout.id, { completed: !workout.completed });
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
        weight: 0,
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
      weight: 0,
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
          <Button onClick={createTodaysWorkout} variant="default">
            <Calendar className="mr-2 h-4 w-4" />
            Treino de Hoje
          </Button>
          <Button onClick={createNewWorkout} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Novo Treino
          </Button>
        </div>
      </div>

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

      {/* Workouts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map(workout => (
          <Card key={workout.id} className="group hover:shadow-md transition-shadow">
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
                  <Badge variant={workout.completed ? "default" : "secondary"}>
                    {workout.completed ? "Concluído" : "Pendente"}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={workout.completed ? "secondary" : "default"}
                    onClick={() => toggleWorkoutCompletion(workout)}
                    className="flex-1"
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

      {filteredWorkouts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Nenhum treino encontrado</p>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro treino'}
            </p>
            {!searchTerm && (
              <Button onClick={createNewWorkout}>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Treino
              </Button>
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
                  {editingWorkout.exercises.map((exercise, exerciseIndex) => (
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
                              <Input
                                type="number"
                                step="0.5"
                                value={set.weight}
                                onChange={(e) => updateSet(
                                  editingWorkout.id, 
                                  exercise.id, 
                                  set.id, 
                                  { weight: parseFloat(e.target.value) || 0 }
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
                    setShowCreateForm(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={() => {
                  updateWorkout(editingWorkout.id, editingWorkout);
                  setEditingWorkout(null);
                  setShowCreateForm(false);
                }}>
                  Salvar Treino
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
