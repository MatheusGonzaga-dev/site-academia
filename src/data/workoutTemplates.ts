import { WorkoutTemplate, WeeklyWorkoutPlan } from '@/types';

export const muscleGroups = {
  PERNA: 'Perna',
  PEITO: 'Peito',
  COSTAS: 'Costas',
  OMBRO: 'Ombro',
  BRACO: 'Braço',
  CARDIO: 'Cardio',
  CORPO_TODO: 'Corpo Todo'
};

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'template-perna',
    name: 'Treino de Perna',
    description: 'Foco em quadríceps, glúteos e panturrilhas',
    muscleGroup: muscleGroups.PERNA,
    category: 'Força',
    exercises: [
      {
        id: 'agachamento',
        name: 'Agachamento Livre',
        targetMuscle: 'Quadríceps/Glúteos',
        sets: []
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        targetMuscle: 'Quadríceps/Glúteos',
        sets: []
      },
      {
        id: 'cadeira-extensora',
        name: 'Cadeira Extensora',
        targetMuscle: 'Quadríceps',
        sets: []
      },
      {
        id: 'mesa-flexora',
        name: 'Mesa Flexora',
        targetMuscle: 'Posterior',
        sets: []
      },
      {
        id: 'panturrilha',
        name: 'Panturrilha em Pé',
        targetMuscle: 'Panturrilhas',
        sets: []
      }
    ]
  },
  {
    id: 'template-peito',
    name: 'Treino de Peito',
    description: 'Foco em peitoral e tríceps',
    muscleGroup: muscleGroups.PEITO,
    category: 'Força',
    exercises: [
      {
        id: 'supino-reto',
        name: 'Supino Reto',
        targetMuscle: 'Peitoral',
        sets: []
      },
      {
        id: 'supino-inclinado',
        name: 'Supino Inclinado',
        targetMuscle: 'Peitoral Superior',
        sets: []
      },
      {
        id: 'crucifixo',
        name: 'Crucifixo',
        targetMuscle: 'Peitoral',
        sets: []
      },
      {
        id: 'triceps-pulley',
        name: 'Tríceps Pulley',
        targetMuscle: 'Tríceps',
        sets: []
      },
      {
        id: 'triceps-testa',
        name: 'Tríceps Testa',
        targetMuscle: 'Tríceps',
        sets: []
      }
    ]
  },
  {
    id: 'template-costas',
    name: 'Treino de Costas',
    description: 'Foco em latíssimo e bíceps',
    muscleGroup: muscleGroups.COSTAS,
    category: 'Força',
    exercises: [
      {
        id: 'puxada-frontal',
        name: 'Puxada Frontal',
        targetMuscle: 'Latíssimo',
        sets: []
      },
      {
        id: 'remada-baixa',
        name: 'Remada Baixa',
        targetMuscle: 'Romboides/Latíssimo',
        sets: []
      },
      {
        id: 'remada-curvada',
        name: 'Remada Curvada',
        targetMuscle: 'Latíssimo',
        sets: []
      },
      {
        id: 'rosca-direta',
        name: 'Rosca Direta',
        targetMuscle: 'Bíceps',
        sets: []
      },
      {
        id: 'rosca-martelo',
        name: 'Rosca Martelo',
        targetMuscle: 'Bíceps/Antebraço',
        sets: []
      }
    ]
  },
  {
    id: 'template-ombro',
    name: 'Treino de Ombro',
    description: 'Foco em deltoides',
    muscleGroup: muscleGroups.OMBRO,
    category: 'Força',
    exercises: [
      {
        id: 'desenvolvimento',
        name: 'Desenvolvimento',
        targetMuscle: 'Deltoide Anterior',
        sets: []
      },
      {
        id: 'elevacao-lateral',
        name: 'Elevação Lateral',
        targetMuscle: 'Deltoide Medial',
        sets: []
      },
      {
        id: 'elevacao-posterior',
        name: 'Elevação Posterior',
        targetMuscle: 'Deltoide Posterior',
        sets: []
      },
      {
        id: 'encolhimento',
        name: 'Encolhimento',
        targetMuscle: 'Trapézio',
        sets: []
      }
    ]
  },
  {
    id: 'template-cardio',
    name: 'Treino Cardio',
    description: 'Exercícios cardiovasculares',
    muscleGroup: muscleGroups.CARDIO,
    category: 'Cardio',
    exercises: [
      {
        id: 'esteira',
        name: 'Esteira',
        targetMuscle: 'Cardiovascular',
        sets: []
      },
      {
        id: 'bicicleta',
        name: 'Bicicleta Ergométrica',
        targetMuscle: 'Cardiovascular',
        sets: []
      },
      {
        id: 'eliptico',
        name: 'Elíptico',
        targetMuscle: 'Cardiovascular',
        sets: []
      }
    ]
  }
];

export const defaultWeeklyPlan: WeeklyWorkoutPlan = {
  id: 'default-plan',
  name: 'Plano Semanal Padrão',
  userId: 'demo-user',
  active: true,
  createdAt: new Date(),
  schedule: {
    1: workoutTemplates[0], // Segunda - Perna
    2: workoutTemplates[1], // Terça - Peito
    3: workoutTemplates[2], // Quarta - Costas
    4: workoutTemplates[0], // Quinta - Perna
    5: workoutTemplates[3], // Sexta - Ombro
    6: workoutTemplates[4], // Sábado - Cardio
    // Domingo - Descanso
  }
};
