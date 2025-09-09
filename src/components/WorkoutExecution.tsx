import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  CheckCircle, 
  Clock, 
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Workout, Exercise, Set } from '@/types';
import { generateUUID } from '@/lib/uuid';
import { WorkoutReport } from './WorkoutReport';

interface WorkoutExecutionProps {
  workout: Workout;
  onClose: () => void;
  onComplete: (workout: Workout) => void;
  onUpdate: (workout: Workout) => void;
}

export function WorkoutExecution({ workout, onClose, onComplete, onUpdate }: WorkoutExecutionProps) {
  console.log('🏋️ WorkoutExecution renderizado com:', { workout: workout.name, onComplete: !!onComplete });
  
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
  const [startTime] = useState(new Date());
  const [showReport, setShowReport] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const updateSet = (exerciseId: string, setId: string, updates: Partial<Set>) => {
    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(exercise =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId ? { ...set, ...updates } : set
              )
            }
          : exercise
      )
    };
    setCurrentWorkout(updatedWorkout);
    onUpdate(updatedWorkout);
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: generateUUID(),
      reps: 12,
      completed: false
    };

    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    };
    setCurrentWorkout(updatedWorkout);
    onUpdate(updatedWorkout);
  };

  const removeSet = (exerciseId: string, setId: string) => {
    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(exercise =>
        exercise.id === exerciseId
          ? { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) }
          : exercise
      )
    };
    setCurrentWorkout(updatedWorkout);
    onUpdate(updatedWorkout);
  };

  const completeWorkout = () => {
    console.log('🎯 Iniciando conclusão do treino...');
    console.log('📊 Séries completadas:', completedSets);
    console.log('🏋️ Treino atual:', currentWorkout);
    
    const workoutEndTime = new Date();
    const duration = Math.round((workoutEndTime.getTime() - startTime.getTime()) / 60000); // em minutos
    
    const completedWorkout = {
      ...currentWorkout,
      completed: true,
      duration
    };
    
    console.log('💾 Treino finalizado:', completedWorkout);
    
    // Mostrar o relatório PRIMEIRO
    console.log('📊 Configurando relatório...');
    setEndTime(workoutEndTime);
    setShowReport(true);
    
    console.log('✅ Relatório configurado para exibição');
    console.log('📊 showReport será:', true);
    console.log('📊 endTime será:', workoutEndTime);
    
    // Salvar o treino DEPOIS (mas NÃO fechar o modal ainda)
    if (onComplete) {
      console.log('💾 Chamando onComplete...');
      onComplete(completedWorkout);
    } else {
      console.error('❌ onComplete não está definido!');
    }
  };

  const completedSets = currentWorkout.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length,
    0
  );
  
  const totalSets = currentWorkout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Dumbbell className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold">{currentWorkout.name}</h2>
              <p className="text-sm text-muted-foreground">
                {format(currentWorkout.date, "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <Clock className="h-4 w-4 inline mr-1" />
              {completedSets}/{totalSets} séries
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {currentWorkout.exercises.map((exercise, exerciseIndex) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{exercise.name}</span>
                    <Badge variant="outline">{exercise.targetMuscle}</Badge>
                  </CardTitle>
                  {exercise.notes && (
                    <CardDescription>{exercise.notes}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium w-8">
                            {setIndex + 1}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exercise.id, set.id, { 
                              reps: parseInt(e.target.value) || 0 
                            })}
                            className="w-16"
                          />
                          <span className="text-sm text-muted-foreground">reps</span>
                        </div>

                        <Button
                          variant={set.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSet(exercise.id, set.id, { 
                            completed: !set.completed 
                          })}
                          className="ml-auto"
                        >
                          {set.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span>✓</span>
                          )}
                        </Button>

                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="text-sm text-muted-foreground">
            Progresso: {completedSets}/{totalSets} séries completadas
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Salvar e Sair
            </Button>
            <Button 
              onClick={() => {
                console.log('🖱️ Botão Concluir Treino clicado!');
                console.log('📊 completedSets:', completedSets);
                console.log('🔒 Botão desabilitado?', completedSets === 0);
                completeWorkout();
              }}
              disabled={completedSets === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Concluir Treino
            </Button>
          </div>
        </div>
      </div>
      
      {/* Relatório de Treino */}
      {showReport && endTime && (
        <WorkoutReport
          workout={currentWorkout}
          startTime={startTime}
          endTime={endTime}
          onClose={() => {
            console.log('🚪 Fechando relatório e modal...');
            setShowReport(false);
            setEndTime(null);
            // Fechar o modal de execução também
            onClose();
          }}
          onDownload={() => {
            console.log('📊 Relatório baixado com sucesso!');
          }}
        />
      )}
      
      {/* Debug do estado do relatório */}
      {console.log('🔍 Estado do relatório:', { showReport, endTime: !!endTime })}
    </div>
  );
}
