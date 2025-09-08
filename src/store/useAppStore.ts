import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workout, WorkoutTemplate, DietEntry, ProgressEntry } from '@/types';

interface AppState {
  // Workouts
  workouts: Workout[];
  workoutTemplates: WorkoutTemplate[];
  
  // Diet
  dietEntries: DietEntry[];
  
  // Progress
  progressEntries: ProgressEntry[];
  
  // Actions
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (id: string, template: Partial<WorkoutTemplate>) => void;
  deleteWorkoutTemplate: (id: string) => void;
  
  addDietEntry: (entry: DietEntry) => void;
  updateDietEntry: (id: string, entry: Partial<DietEntry>) => void;
  deleteDietEntry: (id: string) => void;
  
  addProgressEntry: (entry: ProgressEntry) => void;
  updateProgressEntry: (id: string, entry: Partial<ProgressEntry>) => void;
  deleteProgressEntry: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      workouts: [],
      workoutTemplates: [],
      dietEntries: [],
      progressEntries: [],
      
      // Workout actions
      addWorkout: (workout) =>
        set((state) => ({ workouts: [...state.workouts, workout] })),
      
      updateWorkout: (id, updatedWorkout) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === id ? { ...workout, ...updatedWorkout } : workout
          ),
        })),
      
      deleteWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        })),
      
      // Workout template actions
      addWorkoutTemplate: (template) =>
        set((state) => ({ workoutTemplates: [...state.workoutTemplates, template] })),
      
      updateWorkoutTemplate: (id, updatedTemplate) =>
        set((state) => ({
          workoutTemplates: state.workoutTemplates.map((template) =>
            template.id === id ? { ...template, ...updatedTemplate } : template
          ),
        })),
      
      deleteWorkoutTemplate: (id) =>
        set((state) => ({
          workoutTemplates: state.workoutTemplates.filter((template) => template.id !== id),
        })),
      
      // Diet actions
      addDietEntry: (entry) =>
        set((state) => ({ dietEntries: [...state.dietEntries, entry] })),
      
      updateDietEntry: (id, updatedEntry) =>
        set((state) => ({
          dietEntries: state.dietEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        })),
      
      deleteDietEntry: (id) =>
        set((state) => ({
          dietEntries: state.dietEntries.filter((entry) => entry.id !== id),
        })),
      
      // Progress actions
      addProgressEntry: (entry) =>
        set((state) => ({ progressEntries: [...state.progressEntries, entry] })),
      
      updateProgressEntry: (id, updatedEntry) =>
        set((state) => ({
          progressEntries: state.progressEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updatedEntry } : entry
          ),
        })),
      
      deleteProgressEntry: (id) =>
        set((state) => ({
          progressEntries: state.progressEntries.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: 'academia-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        workouts: state.workouts.map(workout => ({
          ...workout,
          date: workout.date.toISOString()
        })),
        workoutTemplates: state.workoutTemplates,
        dietEntries: state.dietEntries.map(entry => ({
          ...entry,
          date: entry.date.toISOString()
        })),
        progressEntries: state.progressEntries.map(entry => ({
          ...entry,
          date: entry.date.toISOString()
        }))
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.workouts = state.workouts.map(workout => ({
            ...workout,
            date: new Date(workout.date)
          }));
          state.dietEntries = state.dietEntries.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }));
          state.progressEntries = state.progressEntries.map(entry => ({
            ...entry,
            date: new Date(entry.date)
          }));
        }
      }
    }
  )
);
