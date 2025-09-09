import { WorkoutTemplate, WeeklyWorkoutPlan } from '@/types';

export const muscleGroups = {
  PERNA: 'Perna',
  PEITO: 'Peito',
  COSTAS: 'Costas',
  OMBRO: 'Ombro',
  BICEPS: 'Bíceps',
  TRICEPS: 'Tríceps',
  ANTEBRACO: 'Antebraço',
  GLUTEO: 'Glúteo',
  PANTURRILHA: 'Panturrilha',
  ABDOMEN: 'Abdômen',
  TRAPEZIO: 'Trapézio',
  CARDIO: 'Cardio',
  FUNCIONAL: 'Funcional',
  OUTROS: 'Outros'
};

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // UUID válido
    name: 'Treino de Perna',
    description: 'Foco em quadríceps, glúteos e panturrilhas',
    muscleGroup: [muscleGroups.PERNA, muscleGroups.GLUTEO, muscleGroups.PANTURRILHA],
    category: 'Força',
    exercises: [
      {
        id: 'agachamento',
        name: 'Agachamento Livre',
        targetMuscle: 'Quadríceps/Glúteos',
      },
      {
        id: 'leg-press',
        name: 'Leg Press',
        targetMuscle: 'Quadríceps/Glúteos',
      },
      {
        id: 'cadeira-extensora',
        name: 'Cadeira Extensora',
        targetMuscle: 'Quadríceps',
      },
      {
        id: 'mesa-flexora',
        name: 'Mesa Flexora',
        targetMuscle: 'Posterior',
      },
      {
        id: 'panturrilha',
        name: 'Panturrilha em Pé',
        targetMuscle: 'Panturrilhas',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002', // UUID válido
    name: 'Treino de Peito + Tríceps',
    description: 'Foco em peitoral e tríceps',
    muscleGroup: [muscleGroups.PEITO, muscleGroups.TRICEPS],
    category: 'Força',
    exercises: [
      {
        id: 'supino-reto',
        name: 'Supino Reto',
        targetMuscle: 'Peitoral',
      },
      {
        id: 'supino-inclinado',
        name: 'Supino Inclinado',
        targetMuscle: 'Peitoral Superior',
      },
      {
        id: 'crucifixo',
        name: 'Crucifixo',
        targetMuscle: 'Peitoral',
      },
      {
        id: 'triceps-pulley',
        name: 'Tríceps Pulley',
        targetMuscle: 'Tríceps',
      },
      {
        id: 'triceps-testa',
        name: 'Tríceps Testa',
        targetMuscle: 'Tríceps',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003', // UUID válido
    name: 'Treino de Costas + Bíceps',
    description: 'Foco em latíssimo e bíceps',
    muscleGroup: [muscleGroups.COSTAS, muscleGroups.BICEPS],
    category: 'Força',
    exercises: [
      {
        id: 'puxada-frontal',
        name: 'Puxada Frontal',
        targetMuscle: 'Latíssimo',
      },
      {
        id: 'remada-baixa',
        name: 'Remada Baixa',
        targetMuscle: 'Romboides/Latíssimo',
      },
      {
        id: 'remada-curvada',
        name: 'Remada Curvada',
        targetMuscle: 'Latíssimo',
      },
      {
        id: 'rosca-direta',
        name: 'Rosca Direta',
        targetMuscle: 'Bíceps',
      },
      {
        id: 'rosca-martelo',
        name: 'Rosca Martelo',
        targetMuscle: 'Bíceps/Antebraço',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004', // UUID válido
    name: 'Treino de Ombro',
    description: 'Foco em deltoides e trapézio',
    muscleGroup: [muscleGroups.OMBRO, muscleGroups.TRAPEZIO],
    category: 'Força',
    exercises: [
      {
        id: 'desenvolvimento',
        name: 'Desenvolvimento',
        targetMuscle: 'Deltoide Anterior',
      },
      {
        id: 'elevacao-lateral',
        name: 'Elevação Lateral',
        targetMuscle: 'Deltoide Medial',
      },
      {
        id: 'elevacao-posterior',
        name: 'Elevação Posterior',
        targetMuscle: 'Deltoide Posterior',
      },
      {
        id: 'encolhimento',
        name: 'Encolhimento',
        targetMuscle: 'Trapézio',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005', // UUID válido
    name: 'Treino Cardio',
    description: 'Exercícios cardiovasculares',
    muscleGroup: [muscleGroups.CARDIO],
    category: 'Cardio',
    exercises: [
      {
        id: 'esteira',
        name: 'Esteira',
        targetMuscle: 'Cardiovascular',
      },
      {
        id: 'bicicleta',
        name: 'Bicicleta Ergométrica',
        targetMuscle: 'Cardiovascular',
      },
      {
        id: 'eliptico',
        name: 'Elíptico',
        targetMuscle: 'Cardiovascular',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006', // UUID válido
    name: 'Treino de Braço Completo',
    description: 'Foco em bíceps, tríceps e antebraço',
    muscleGroup: [muscleGroups.BICEPS, muscleGroups.TRICEPS, muscleGroups.ANTEBRACO],
    category: 'Força',
    exercises: [
      {
        id: 'rosca-direta',
        name: 'Rosca Direta',
        targetMuscle: 'Bíceps',
      },
      {
        id: 'triceps-pulley',
        name: 'Tríceps Pulley',
        targetMuscle: 'Tríceps',
      },
      {
        id: 'rosca-martelo',
        name: 'Rosca Martelo',
        targetMuscle: 'Bíceps/Antebraço',
      },
      {
        id: 'triceps-testa',
        name: 'Tríceps Testa',
        targetMuscle: 'Tríceps',
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007', // UUID válido
    name: 'Treino Funcional',
    description: 'Exercícios funcionais e core',
    muscleGroup: [muscleGroups.FUNCIONAL, muscleGroups.ABDOMEN],
    category: 'Funcional',
    exercises: [
      {
        id: 'burpee',
        name: 'Burpee',
        targetMuscle: 'Corpo Todo',
      },
      {
        id: 'mountain-climber',
        name: 'Mountain Climber',
        targetMuscle: 'Core/Cardio',
      },
      {
        id: 'plank',
        name: 'Prancha',
        targetMuscle: 'Core',
      }
    ]
  }
];

export const defaultWeeklyPlan: WeeklyWorkoutPlan = {
  id: '550e8400-e29b-41d4-a716-446655440000', // UUID válido para o plano padrão
  name: 'Meu Plano Semanal',
  userId: 'demo-user',
  active: true,
  createdAt: new Date(),
  schedule: {
    // Plano vazio - configure cada dia como quiser
  }
};
