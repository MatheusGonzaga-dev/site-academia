export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  duration?: number; // in minutes
  notes?: string;
  completed: boolean;
  fromWeeklyPlan?: boolean; // identifica se foi criado pelo plano semanal
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<Exercise, 'sets'>[];
  category: string;
  muscleGroup: string | string[]; // Suporte para múltiplos grupos musculares
  dayOfWeek?: number; // 0 = domingo, 1 = segunda, etc.
}

export interface WeeklyWorkoutPlan {
  id: string;
  name: string;
  userId: string;
  schedule: {
    [key: number]: WorkoutTemplate; // 0-6 para domingo-sábado
  };
  active: boolean;
  createdAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
  unit: string;
}

export interface DietEntry {
  id: string;
  date: Date;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  waterIntake: number; // in ml
  notes?: string;
}

export interface ProgressEntry {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
  notes?: string;
}
