import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Workout, DietEntry, ProgressEntry } from '@/types';

interface AppState {
  // Data
  workouts: Workout[];
  dietEntries: DietEntry[];
  progressEntries: ProgressEntry[];
  
  // Loading states
  loading: {
    workouts: boolean;
    dietEntries: boolean;
    progressEntries: boolean;
  };
  
  // User ID (simplificado para demo - em produção usaria autenticação)
  userId: string;
  
  // Actions
  setUserId: (userId: string) => void;
  
  // Workout actions
  loadWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;
  updateWorkout: (id: string, workout: Partial<Workout>) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  
  // Diet actions
  loadDietEntries: () => Promise<void>;
  addDietEntry: (entry: Omit<DietEntry, 'id'>) => Promise<void>;
  updateDietEntry: (id: string, entry: Partial<DietEntry>) => Promise<void>;
  deleteDietEntry: (id: string) => Promise<void>;
  
  // Progress actions
  loadProgressEntries: () => Promise<void>;
  addProgressEntry: (entry: Omit<ProgressEntry, 'id'>) => Promise<void>;
  updateProgressEntry: (id: string, entry: Partial<ProgressEntry>) => Promise<void>;
  deleteProgressEntry: (id: string) => Promise<void>;
}

export const useSupabaseStore = create<AppState>((set, get) => ({
  workouts: [],
  dietEntries: [],
  progressEntries: [],
  loading: {
    workouts: false,
    dietEntries: false,
    progressEntries: false,
  },
  userId: 'demo-user', // ID simples para demo
  
  setUserId: (userId) => set({ userId }),
  
  // Workout actions
  loadWorkouts: async () => {
    set(state => ({ loading: { ...state.loading, workouts: true } }));
    
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', get().userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const workouts = data?.map(item => ({
        ...item,
        date: new Date(item.date),
        exercises: item.exercises || []
      })) || [];
      
      set({ workouts, loading: { ...get().loading, workouts: false } });
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      set(state => ({ loading: { ...state.loading, workouts: false } }));
    }
  },
  
  addWorkout: async (workoutData) => {
    try {
      const workout = {
        ...workoutData,
        id: crypto.randomUUID(),
        user_id: get().userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('workouts')
        .insert([{
          id: workout.id,
          user_id: workout.user_id,
          name: workout.name,
          date: workout.date.toISOString(),
          exercises: workout.exercises,
          duration: workout.duration,
          notes: workout.notes,
          completed: workout.completed,
          created_at: workout.created_at,
          updated_at: workout.updated_at,
        }]);
      
      if (error) throw error;
      
      set(state => ({ workouts: [workout, ...state.workouts] }));
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
    }
  },
  
  updateWorkout: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({
          ...updates,
          date: updates.date?.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        workouts: state.workouts.map(workout =>
          workout.id === id ? { ...workout, ...updates } : workout
        )
      }));
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
    }
  },
  
  deleteWorkout: async (id) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        workouts: state.workouts.filter(workout => workout.id !== id)
      }));
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
    }
  },
  
  // Diet actions
  loadDietEntries: async () => {
    set(state => ({ loading: { ...state.loading, dietEntries: true } }));
    
    try {
      const { data, error } = await supabase
        .from('diet_entries')
        .select('*')
        .eq('user_id', get().userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const dietEntries = data?.map(item => ({
        ...item,
        date: new Date(item.date),
        meals: item.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] }
      })) || [];
      
      set({ dietEntries, loading: { ...get().loading, dietEntries: false } });
    } catch (error) {
      console.error('Erro ao carregar entradas de dieta:', error);
      set(state => ({ loading: { ...state.loading, dietEntries: false } }));
    }
  },
  
  addDietEntry: async (entryData) => {
    try {
      const entry = {
        ...entryData,
        id: crypto.randomUUID(),
        user_id: get().userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('diet_entries')
        .insert([{
          id: entry.id,
          user_id: entry.user_id,
          date: entry.date.toISOString(),
          meals: entry.meals,
          water_intake: entry.waterIntake,
          notes: entry.notes,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        }]);
      
      if (error) throw error;
      
      set(state => ({ dietEntries: [entry, ...state.dietEntries] }));
    } catch (error) {
      console.error('Erro ao adicionar entrada de dieta:', error);
    }
  },
  
  updateDietEntry: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('diet_entries')
        .update({
          ...updates,
          date: updates.date?.toISOString(),
          water_intake: updates.waterIntake,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        dietEntries: state.dietEntries.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      }));
    } catch (error) {
      console.error('Erro ao atualizar entrada de dieta:', error);
    }
  },
  
  deleteDietEntry: async (id) => {
    try {
      const { error } = await supabase
        .from('diet_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        dietEntries: state.dietEntries.filter(entry => entry.id !== id)
      }));
    } catch (error) {
      console.error('Erro ao deletar entrada de dieta:', error);
    }
  },
  
  // Progress actions
  loadProgressEntries: async () => {
    set(state => ({ loading: { ...state.loading, progressEntries: true } }));
    
    try {
      const { data, error } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', get().userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const progressEntries = data?.map(item => ({
        ...item,
        date: new Date(item.date),
        measurements: item.measurements || {}
      })) || [];
      
      set({ progressEntries, loading: { ...get().loading, progressEntries: false } });
    } catch (error) {
      console.error('Erro ao carregar entradas de progresso:', error);
      set(state => ({ loading: { ...state.loading, progressEntries: false } }));
    }
  },
  
  addProgressEntry: async (entryData) => {
    try {
      const entry = {
        ...entryData,
        id: crypto.randomUUID(),
        user_id: get().userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('progress_entries')
        .insert([{
          id: entry.id,
          user_id: entry.user_id,
          date: entry.date.toISOString(),
          weight: entry.weight,
          body_fat: entry.bodyFat,
          measurements: entry.measurements,
          notes: entry.notes,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        }]);
      
      if (error) throw error;
      
      set(state => ({ progressEntries: [entry, ...state.progressEntries] }));
    } catch (error) {
      console.error('Erro ao adicionar entrada de progresso:', error);
    }
  },
  
  updateProgressEntry: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('progress_entries')
        .update({
          ...updates,
          date: updates.date?.toISOString(),
          body_fat: updates.bodyFat,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        progressEntries: state.progressEntries.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      }));
    } catch (error) {
      console.error('Erro ao atualizar entrada de progresso:', error);
    }
  },
  
  deleteProgressEntry: async (id) => {
    try {
      const { error } = await supabase
        .from('progress_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', get().userId);
      
      if (error) throw error;
      
      set(state => ({
        progressEntries: state.progressEntries.filter(entry => entry.id !== id)
      }));
    } catch (error) {
      console.error('Erro ao deletar entrada de progresso:', error);
    }
  },
}));
