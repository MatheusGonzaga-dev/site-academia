import { useEffect } from 'react';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { useUserId } from './useUserId';
import { sampleWorkouts, sampleDietEntry, sampleProgressEntries } from '@/data/sampleData';

export function useSupabaseInit() {
  const userId = useUserId();
  const { 
    workouts, 
    dietEntries, 
    progressEntries,
    setUserId,
    loadWeeklyPlan,
    addWorkout,
    addDietEntry,
    addProgressEntry
  } = useSupabaseStore();

  useEffect(() => {
    // Configurar userId quando disponível
    if (userId) {
      setUserId(userId);
      // Carregar plano semanal quando userId estiver disponível
      loadWeeklyPlan();
    }
  }, [userId, setUserId, loadWeeklyPlan]);

  // Remover carregamento automático de dados - será feito em cada página

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
