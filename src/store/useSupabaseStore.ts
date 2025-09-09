import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { generateUUID } from '@/lib/uuid';
import { Workout, DietEntry, ProgressEntry, WorkoutTemplate, WeeklyWorkoutPlan } from '@/types';
import { defaultWeeklyPlan, workoutTemplates } from '@/data/workoutTemplates';

interface AppState {
  // Data
  workouts: Workout[];
  dietEntries: DietEntry[];
  progressEntries: ProgressEntry[];
  weeklyPlan: WeeklyWorkoutPlan;
  workoutTemplates: WorkoutTemplate[];
  
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
  
  // Weekly plan actions
  loadWeeklyPlan: () => Promise<void>;
  saveWeeklyPlan: (plan: WeeklyWorkoutPlan) => Promise<void>;
  updateWeeklyPlan: (plan: WeeklyWorkoutPlan) => Promise<void>;
  updateWeeklyPlanDay: (dayOfWeek: number, template: WorkoutTemplate | null) => Promise<void>;
  generateTodaysWorkout: () => Workout | null;
  
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
  weeklyPlan: defaultWeeklyPlan,
  workoutTemplates: workoutTemplates,
  loading: {
    workouts: false,
    dietEntries: false,
    progressEntries: false,
  },
  userId: 'demo-user', // ID simples para demo
  
  setUserId: (userId) => set({ userId }),
  
  // Weekly plan actions
  loadWeeklyPlan: async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', get().userId)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const planData = data[0];
        const weeklyPlan: WeeklyWorkoutPlan = {
          id: planData.id,
          name: planData.name,
          userId: planData.user_id,
          schedule: planData.schedule || {},
          active: planData.active,
          createdAt: new Date(planData.created_at),
        };
        
        console.log('📅 Plano semanal carregado:', {
          id: weeklyPlan.id,
          nome: weeklyPlan.name,
          diasComTreino: Object.keys(weeklyPlan.schedule).length,
          detalhesSchedule: Object.entries(weeklyPlan.schedule).map(([dia, template]) => ({
            dia,
            nome: template?.name,
            exercicios: template?.exercises?.length || 0
          }))
        });
        
        set({ weeklyPlan });
      }
    } catch (error) {
      console.error('Erro ao carregar plano semanal:', error);
    }
  },

  saveWeeklyPlan: async (plan) => {
    console.log('🔄 Salvando plano semanal:', plan);
    try {
      const planData = {
        user_id: get().userId,
        name: plan.name,
        schedule: plan.schedule,
        active: plan.active !== false, // garante que active seja true por padrão
        updated_at: new Date().toISOString(),
      };

      console.log('📦 Dados para salvar:', planData);

      // Se o plano já tem ID, atualizar; senão, criar novo
      if (plan.id) {
        console.log('📝 Atualizando plano existente:', plan.id);
        // Atualizar plano existente
        const { data, error } = await supabase
          .from('weekly_plans')
          .update(planData)
          .eq('id', plan.id)
          .eq('user_id', get().userId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('✅ Plano atualizado com sucesso!', data);
        
        // Atualizar o estado local com os dados retornados
        set({ 
          weeklyPlan: { 
            ...plan, 
            ...data,
            schedule: data.schedule,
            updatedAt: new Date(data.updated_at)
          } 
        });
      } else {
        console.log('🆕 Criando novo plano...');
        // Desativar planos antigos primeiro
        await supabase
          .from('weekly_plans')
          .update({ active: false })
          .eq('user_id', get().userId)
          .eq('active', true);

        // Criar novo plano
        const newId = generateUUID();
        const { data, error } = await supabase
          .from('weekly_plans')
          .insert([{
            ...planData,
            id: newId,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();
        
        if (error) throw error;
        console.log('✅ Novo plano criado:', data);
        
        // Atualizar o estado com o ID retornado
        set({ 
          weeklyPlan: { 
            ...plan, 
            id: data.id,
            schedule: data.schedule,
            active: data.active,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at)
          } 
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar plano semanal:', error);
      console.error('❌ Detalhes do erro:', error.message);
      throw error; // Re-lançar o erro para que a UI possa lidar com ele
    }
  },

  updateWeeklyPlan: async (plan) => {
    set({ weeklyPlan: plan });
    // Salvar automaticamente no banco
    await get().saveWeeklyPlan(plan);
  },
  
  updateWeeklyPlanDay: async (dayOfWeek, template) => {
    console.log(`🎯 Atualizando dia ${dayOfWeek}:`, template ? template.name : 'Descanso');
    
    const currentPlan = get().weeklyPlan;
    console.log('📋 Plano atual:', currentPlan);
    
    const newSchedule = { ...currentPlan.schedule };
    
    if (template) {
      newSchedule[dayOfWeek] = template;
      console.log(`✅ Adicionado treino "${template.name}" ao dia ${dayOfWeek}`);
    } else {
      delete newSchedule[dayOfWeek];
      console.log(`🗑️ Removido treino do dia ${dayOfWeek}`);
    }
    
    const updatedPlan = {
      ...currentPlan,
      schedule: newSchedule
    };
    
    console.log('📝 Plano atualizado:', updatedPlan);
    
    // Atualizar estado local primeiro
    set({ weeklyPlan: updatedPlan });
    
    // Salvar automaticamente no banco
    console.log('💾 Salvando no banco...');
    await get().saveWeeklyPlan(updatedPlan);
    console.log('✅ Salvamento concluído!');
  },
  
  generateTodaysWorkout: () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.
    const plan = get().weeklyPlan;
    
    if (!plan.schedule[dayOfWeek]) {
      return null; // Dia de descanso
    }
    
    const template = plan.schedule[dayOfWeek];
    const workout: Workout = {
      id: generateUUID(),
      name: template.name,
      date: today,
      completed: false,
            from_weekly_plan: true, // marca como criado pelo plano semanal
      exercises: template.exercises.map(exercise => ({
        ...exercise,
        sets: [
          { id: generateUUID(), reps: 12, completed: false },
          { id: generateUUID(), reps: 10, completed: false },
          { id: generateUUID(), reps: 8, completed: false }
        ]
      }))
    };
    
    return workout;
  },
  
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
        exercises: item.exercises || [],
        fromWeeklyPlan: item.from_weekly_plan || false
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
        id: generateUUID(),
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
          from_weekly_plan: workout.fromWeeklyPlan || false,
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
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      
      // Mapear apenas campos válidos (excluir fromWeeklyPlan)
      Object.keys(updates).forEach(key => {
        if (key !== 'fromWeeklyPlan' && key !== 'date') {
          updateData[key] = updates[key as keyof typeof updates];
        }
      });
      
      // Só incluir campos que existem
      if (updates.date) updateData.date = updates.date.toISOString();
      if (updates.fromWeeklyPlan !== undefined) updateData.from_weekly_plan = updates.fromWeeklyPlan;
      
      console.log('💾 Dados para atualizar treino:', updateData);
      
      const { error } = await supabase
        .from('workouts')
        .update(updateData)
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
        id: generateUUID(),
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
        id: generateUUID(),
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
