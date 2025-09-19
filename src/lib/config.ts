// Configurações da aplicação
export const config = {
  app: {
    name: 'Academia Fitness',
    description: 'Gerencie seus treinos e dieta de forma inteligente',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  features: {
    pwa: true,
    auth: {
      email: true,
      google: true,
    },
    workout: {
      enabled: true,
      maxExercisesPerWorkout: 20,
    },
    diet: {
      enabled: true,
      maxProductsPerMeal: 50,
    },
  },
} as const

// Validação das variáveis de ambiente
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
