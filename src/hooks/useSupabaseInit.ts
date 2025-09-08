import { useEffect } from 'react';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { sampleWorkouts, sampleDietEntry, sampleProgressEntries } from '@/data/sampleData';

export function useSupabaseInit() {
  const { 
    workouts, 
    dietEntries, 
    progressEntries,
    loadWorkouts,
    loadDietEntries,
    loadProgressEntries,
    addWorkout,
    addDietEntry,
    addProgressEntry
  } = useSupabaseStore();

  useEffect(() => {
    // Carregar dados do Supabase
    const loadData = async () => {
      await Promise.all([
        loadWorkouts(),
        loadDietEntries(),
        loadProgressEntries()
      ]);
    };

    loadData();
  }, [loadWorkouts, loadDietEntries, loadProgressEntries]);

  // Função para popular com dados de exemplo (apenas se estiver vazio)
  const populateSampleData = async () => {
    if (workouts.length === 0 && dietEntries.length === 0 && progressEntries.length === 0) {
      try {
        // Adicionar treinos de exemplo
        for (const workout of sampleWorkouts) {
          await addWorkout(workout);
        }
        
        // Adicionar entrada de dieta de exemplo
        await addDietEntry(sampleDietEntry);
        
        // Adicionar entradas de progresso de exemplo
        for (const entry of sampleProgressEntries) {
          await addProgressEntry(entry);
        }
        
        console.log('Dados de exemplo adicionados com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar dados de exemplo:', error);
      }
    }
  };

  return { populateSampleData };
}
