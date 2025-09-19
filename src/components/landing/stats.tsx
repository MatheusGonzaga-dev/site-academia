'use client'

import { motion } from 'framer-motion'
import { Users, Dumbbell, Apple, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Usuários Ativos',
    description: 'Pessoas transformando suas vidas',
    color: 'text-fitness-600'
  },
  {
    icon: Dumbbell,
    value: '1,000,000+',
    label: 'Treinos Realizados',
    description: 'Exercícios completados com sucesso',
    color: 'text-fitness-600'
  },
  {
    icon: Apple,
    value: '500,000+',
    label: 'Refeições Registradas',
    description: 'Refeições monitoradas e planejadas',
    color: 'text-nutrition-600'
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Taxa de Sucesso',
    description: 'Usuários que alcançam suas metas',
    color: 'text-green-600'
  }
]

export function Stats() {
  return (
    <section className="py-24 bg-gradient-to-r from-fitness-600 to-nutrition-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Números que{' '}
            <span className="text-yellow-300">comprovam</span> nosso sucesso
          </h2>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Milhares de pessoas já transformaram suas vidas com nossa plataforma. 
            Veja os resultados impressionantes que nossos usuários alcançaram.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="relative">
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full bg-white/10 blur-xl"></div>
                </div>
                
                {/* Icon */}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                
                {/* Value */}
                <motion.div
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-white sm:text-5xl"
                >
                  {stat.value}
                </motion.div>
                
                {/* Label */}
                <div className="mt-2 text-lg font-semibold text-white">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="mt-1 text-sm text-blue-200">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Junte-se à revolução fitness
            </h3>
            <p className="text-lg text-blue-100 mb-6">
              Faça parte de uma comunidade que está transformando vidas todos os dias
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <span>✓ Sem taxas ocultas</span>
              <span>✓ Suporte 24/7</span>
              <span>✓ Atualizações constantes</span>
              <span>✓ Dados seguros</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

