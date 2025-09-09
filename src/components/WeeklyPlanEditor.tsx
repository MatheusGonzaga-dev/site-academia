import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  Plus, 
  Trash2, 
  Dumbbell,
  Save
} from 'lucide-react';
import { WorkoutTemplate, Exercise, Set } from '@/types';
import { generateUUID } from '@/lib/uuid';

interface WeeklyPlanEditorProps {
  dayOfWeek: number;
  dayName: string;
  template: WorkoutTemplate | null;
  onSave: (dayOfWeek: number, template: WorkoutTemplate | null) => void;
  onClose: () => void;
}

export function WeeklyPlanEditor({ dayOfWeek, dayName, template, onSave, onClose }: WeeklyPlanEditorProps) {
  const [currentTemplate, setCurrentTemplate] = useState<WorkoutTemplate | null>(
    template ? {
      ...template,
      muscleGroup: Array.isArray(template.muscleGroup) 
        ? template.muscleGroup 
        : template.muscleGroup ? [template.muscleGroup] : []
    } : {
      id: generateUUID(),
      name: '',
      description: '',
      exercises: [],
      category: '',
      muscleGroup: [],
      dayOfWeek
    }
  );

  const [isRestDay, setIsRestDay] = useState(!template);

  // Função para gerenciar seleção múltipla de grupos musculares
  const toggleMuscleGroup = (group: string) => {
    if (!currentTemplate) return;
    
    const currentGroups = Array.isArray(currentTemplate.muscleGroup) 
      ? currentTemplate.muscleGroup 
      : currentTemplate.muscleGroup ? [currentTemplate.muscleGroup] : [];
    
    const newGroups = currentGroups.includes(group)
      ? currentGroups.filter(g => g !== group)
      : [...currentGroups, group];
    
    setCurrentTemplate({
      ...currentTemplate,
      muscleGroup: newGroups
    });
  };

  const addExercise = () => {
    if (!currentTemplate) return;
    
    const newExercise: Exercise = {
      id: generateUUID(),
      name: 'Novo Exercício',
      targetMuscle: 'Peito',
      sets: [
        { id: generateUUID(), reps: 6, completed: false },
        { id: generateUUID(), reps: 8, completed: false },
        { id: generateUUID(), reps: 10, completed: false }
      ]
    };

    setCurrentTemplate({
      ...currentTemplate,
      exercises: [...currentTemplate.exercises, newExercise]
    });
  };

  const removeExercise = (exerciseId: string) => {
    if (!currentTemplate) return;
    
    setCurrentTemplate({
      ...currentTemplate,
      exercises: currentTemplate.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    if (!currentTemplate) return;
    
    setCurrentTemplate({
      ...currentTemplate,
      exercises: currentTemplate.exercises.map(ex =>
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    });
  };


  const handleSave = () => {
    if (isRestDay) {
      console.log('💤 Salvando dia de descanso');
      onSave(dayOfWeek, null);
    } else if (currentTemplate) {
      console.log('🏋️ Salvando template:', {
        nome: currentTemplate.name,
        exercicios: currentTemplate.exercises.length,
        detalhes: currentTemplate.exercises.map(ex => ({
          nome: ex.name,
          musculo: ex.targetMuscle,
          series: ex.sets.length
        }))
      });
      onSave(dayOfWeek, {
        ...currentTemplate,
        dayOfWeek
      });
    }
    onClose();
  };

  const muscleGroups = [
    'Peito', 'Costas', 'Ombro', 'Bíceps', 'Tríceps', 'Antebraço',
    'Perna', 'Glúteo', 'Panturrilha', 'Abdômen', 'Trapézio',
    'Cardio', 'Funcional', 'Outros'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Dumbbell className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Editar {dayName}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Configure o treino para este dia da semana
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-4 sm:space-y-6">
            {/* Rest Day Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configuração do Dia</span>
                  <Badge variant={isRestDay ? "secondary" : "default"}>
                    {isRestDay ? "Dia de Descanso" : "Dia de Treino"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button
                    variant={isRestDay ? "default" : "outline"}
                    onClick={() => setIsRestDay(true)}
                    className="flex-1"
                  >
                    Dia de Descanso
                  </Button>
                  <Button
                    variant={!isRestDay ? "default" : "outline"}
                    onClick={() => setIsRestDay(false)}
                    className="flex-1"
                  >
                    Dia de Treino
                  </Button>
                </div>
              </CardContent>
            </Card>

            {!isRestDay && currentTemplate && (
              <>
                {/* Workout Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Treino</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome do Treino</label>
                      <Input
                        value={currentTemplate.name}
                        onChange={(e) => setCurrentTemplate({
                          ...currentTemplate,
                          name: e.target.value
                        })}
                        placeholder="Ex: Treino de Peito"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Descrição (opcional)</label>
                      <Textarea
                        value={currentTemplate.description || ''}
                        onChange={(e) => setCurrentTemplate({
                          ...currentTemplate,
                          description: e.target.value
                        })}
                        placeholder="Descrição do treino..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Categoria</label>
                        <Input
                          value={currentTemplate.category}
                          onChange={(e) => setCurrentTemplate({
                            ...currentTemplate,
                            category: e.target.value
                          })}
                          placeholder="Ex: Força"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Grupos Musculares</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mt-3">
                          {muscleGroups.map(group => {
                            const currentGroups = Array.isArray(currentTemplate.muscleGroup) 
                              ? currentTemplate.muscleGroup 
                              : currentTemplate.muscleGroup ? [currentTemplate.muscleGroup] : [];
                            const isSelected = currentGroups.includes(group);
                            
                            return (
                              <label 
                                key={group} 
                                className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-sm ${
                                  isSelected 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-gray-200 hover:border-primary/50'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleMuscleGroup(group)}
                                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 flex-shrink-0"
                                />
                                <span className="text-xs sm:text-sm font-medium truncate">{group}</span>
                              </label>
                            );
                          })}
                        </div>
                        {Array.isArray(currentTemplate.muscleGroup) && currentTemplate.muscleGroup.length > 0 && (
                          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <div className="text-sm font-medium text-primary mb-2">
                              Grupos Selecionados:
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {currentTemplate.muscleGroup.map(group => (
                                <span 
                                  key={group}
                                  className="inline-flex items-center px-2 sm:px-2.5 py-1 sm:py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                                >
                                  {group}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Exercises */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                          <Dumbbell className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            Exercícios ({currentTemplate.exercises.length})
                          </span>
                          <div className="text-sm text-gray-600 font-normal">
                            {currentTemplate.exercises.length > 0 && (
                              <>
                                {currentTemplate.exercises[0].sets.length} séries por exercício
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={addExercise} 
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Exercício
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentTemplate.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                          {/* Cabeçalho do Exercício */}
                          <div className="flex flex-col space-y-3 mb-4 sm:mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full font-bold text-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Input
                                  value={exercise.name}
                                  onChange={(e) => updateExercise(exercise.id, { name: e.target.value })}
                                  placeholder="Nome do exercício"
                                  className="text-base sm:text-lg font-medium border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3 pl-11 sm:pl-13">
                              <select
                                value={exercise.targetMuscle}
                                onChange={(e) => updateExercise(exercise.id, { targetMuscle: e.target.value })}
                                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:border-primary flex-1 sm:flex-none"
                              >
                                {muscleGroups.map(group => (
                                  <option key={group} value={group}>{group}</option>
                                ))}
                              </select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExercise(exercise.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Séries e Repetições */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">
                                Séries e Repetições
                              </span>
                            </div>
                            
                            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Número de Séries */}
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Número de Séries</label>
                                  <Input
                                    type="number"
                                    value={exercise.sets.length}
                                    onChange={(e) => {
                                      const newCount = parseInt(e.target.value) || 1;
                                      const currentSets = exercise.sets;
                                      
                                      if (newCount > currentSets.length) {
                                        // Adicionar séries
                                        const setsToAdd = newCount - currentSets.length;
                                        const newSets = Array.from({ length: setsToAdd }, () => ({
                                          id: generateUUID(),
                                          reps: 12,
                                          completed: false
                                        }));
                                        updateExercise(exercise.id, { sets: [...currentSets, ...newSets] });
                                      } else if (newCount < currentSets.length) {
                                        // Remover séries
                                        updateExercise(exercise.id, { sets: currentSets.slice(0, newCount) });
                                      }
                                    }}
                                    placeholder="3"
                                    className="text-center border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                                    min="1"
                                    max="10"
                                  />
                                </div>

                                {/* Repetições Mínimas */}
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Reps Mínimas</label>
                                  <Input
                                    type="number"
                                    value={exercise.sets[0]?.reps || 6}
                                    onChange={(e) => {
                                      const minReps = parseInt(e.target.value) || 6;
                                      const updatedSets = exercise.sets.map(set => ({ ...set, reps: minReps }));
                                      updateExercise(exercise.id, { sets: updatedSets });
                                    }}
                                    placeholder="6"
                                    className="text-center border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                                    min="1"
                                  />
                                </div>

                                {/* Repetições Máximas */}
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">Reps Máximas</label>
                                  <Input
                                    type="number"
                                    value={exercise.sets[exercise.sets.length - 1]?.reps || 10}
                                    onChange={(e) => {
                                      const maxReps = parseInt(e.target.value) || 10;
                                      const minReps = exercise.sets[0]?.reps || 6;
                                      const updatedSets = exercise.sets.map((set, index) => {
                                        // Progressão linear das repetições
                                        const progress = index / (exercise.sets.length - 1);
                                        const reps = Math.round(minReps + (maxReps - minReps) * progress);
                                        return { ...set, reps };
                                      });
                                      updateExercise(exercise.id, { sets: updatedSets });
                                    }}
                                    placeholder="10"
                                    className="text-center border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                                    min="1"
                                  />
                                </div>
                              </div>


                              {/* Preview das Séries */}
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
                                <div className="text-sm text-gray-600">
                                  {exercise.sets.length} série{exercise.sets.length > 1 ? 's' : ''} de {exercise.sets[0]?.reps || 6} até {exercise.sets[exercise.sets.length - 1]?.reps || 10} repetições
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {currentTemplate.exercises.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Dumbbell className="h-10 w-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum exercício adicionado
                          </h3>
                          <p className="text-gray-500 mb-6">
                            Comece adicionando exercícios para criar seu treino
                          </p>
                          <Button 
                            onClick={addExercise}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Primeiro Exercício
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-t bg-gray-50 flex-shrink-0 space-y-3 sm:space-y-0">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            {isRestDay 
              ? 'Dia de descanso configurado' 
              : `${currentTemplate?.exercises.length || 0} exercícios configurados`
            }
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Salvar {dayName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
