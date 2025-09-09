import { Workout, DietEntry, ProgressEntry } from '@/types';

export const sampleWorkouts: Workout[] = [
  {
    id: 'workout-1',
    name: 'Treino de Peito e Tríceps',
    date: new Date(),
    completed: false,
    exercises: [
      {
        id: 'exercise-1',
        name: 'Supino Reto',
        targetMuscle: 'Peito',
        sets: [
          { id: 'set-1', reps: 12, completed: false },
          { id: 'set-2', reps: 10, completed: false },
          { id: 'set-3', reps: 8, completed: false }
        ]
      },
      {
        id: 'exercise-2',
        name: 'Supino Inclinado',
        targetMuscle: 'Peito',
        sets: [
          { id: 'set-4', reps: 12, completed: false },
          { id: 'set-5', reps: 10, completed: false },
          { id: 'set-6', reps: 8, completed: false }
        ]
      },
      {
        id: 'exercise-3',
        name: 'Tríceps Pulley',
        targetMuscle: 'Tríceps',
        sets: [
          { id: 'set-7', reps: 15, completed: false },
          { id: 'set-8', reps: 12, completed: false },
          { id: 'set-9', reps: 10, completed: false }
        ]
      }
    ],
    duration: 60
  },
  {
    id: 'workout-2',
    name: 'Treino de Costas e Bíceps',
    date: new Date(Date.now() - 86400000), // Yesterday
    completed: true,
    exercises: [
      {
        id: 'exercise-4',
        name: 'Puxada Frontal',
        targetMuscle: 'Costas',
        sets: [
          { id: 'set-10', reps: 12, completed: true },
          { id: 'set-11', reps: 10, completed: true },
          { id: 'set-12', reps: 8, completed: true }
        ]
      },
      {
        id: 'exercise-5',
        name: 'Remada Baixa',
        targetMuscle: 'Costas',
        sets: [
          { id: 'set-13', reps: 12, completed: true },
          { id: 'set-14', reps: 10, completed: true }
        ]
      }
    ],
    duration: 55
  }
];

export const sampleDietEntry: DietEntry = {
  id: 'diet-1',
  date: new Date(),
  waterIntake: 2000,
  meals: {
    breakfast: [
      {
        id: 'meal-1',
        name: 'Aveia com Banana',
        calories: 350,
        protein: 12,
        carbs: 65,
        fats: 8,
        quantity: 1,
        unit: 'porção'
      },
      {
        id: 'meal-2',
        name: 'Café com Leite',
        calories: 80,
        protein: 4,
        carbs: 8,
        fats: 3,
        quantity: 200,
        unit: 'ml'
      }
    ],
    lunch: [
      {
        id: 'meal-3',
        name: 'Peito de Frango Grelhado',
        calories: 250,
        protein: 45,
        carbs: 0,
        fats: 5,
        quantity: 150,
        unit: 'g'
      },
      {
        id: 'meal-4',
        name: 'Arroz Integral',
        calories: 220,
        protein: 5,
        carbs: 45,
        fats: 2,
        quantity: 100,
        unit: 'g'
      }
    ],
    dinner: [],
    snacks: [
      {
        id: 'meal-5',
        name: 'Whey Protein',
        calories: 120,
        protein: 25,
        carbs: 2,
        fats: 1,
        quantity: 30,
        unit: 'g'
      }
    ]
  }
};

export const sampleProgressEntries: ProgressEntry[] = [
  {
    id: 'progress-1',
    date: new Date(),
    weight: 75.2,
    bodyFat: 12.5,
    measurements: {
      chest: 95,
      waist: 78,
      arms: 35,
      thighs: 55
    },
    notes: 'Me sentindo bem, energia alta para os treinos!'
  },
  {
    id: 'progress-2',
    date: new Date(Date.now() - 7 * 86400000), // 1 week ago
    weight: 75.8,
    bodyFat: 13.0,
    measurements: {
      chest: 94,
      waist: 79,
      arms: 34.5,
      thighs: 54.5
    },
    notes: 'Primeira semana de cutting, reduzindo carboidratos.'
  }
];
