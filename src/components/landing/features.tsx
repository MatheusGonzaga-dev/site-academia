'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Apple, 
  BarChart3, 
  Calendar, 
  Target, 
  Users, 
  Smartphone, 
  Shield,
  Zap,
  Heart
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Dumbbell,
    title: 'Treinos Personalizados',
    description: 'Crie e gerencie seus treinos com exercícios específicos para cada grupo muscular.',
    color: 'fitness',
    gradient: 'from-fitness-500 to-fitness-600'
  },
  {
    icon: Apple,
    title: 'Controle de Dieta',
    description: 'Monitore suas refeições, calorias e macronutrientes de forma inteligente.',
    color: 'nutrition',
    gradient: 'from-nutrition-500 to-nutrition-600'
  },
  {
    icon: BarChart3,
    title: 'Acompanhamento de Progresso',
    description: 'Visualize seu progresso com gráficos e estatísticas detalhadas.',
    color: 'info',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Calendar,
    title: 'Planejamento Semanal',
    description: 'Organize seus treinos e refeições por dias da semana.',
    color: 'warning',
    gradient: 'from-warning-500 to-warning-600'
  },
  {
    icon: Target,
    title: 'Metas Inteligentes',
    description: 'Defina e acompanhe suas metas de forma personalizada.',
    color: 'success',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: Users,
    title: 'Comunidade',
    description: 'Conecte-se com outros usuários e compartilhe experiências.',
    color: 'fitness',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: Smartphone,
    title: 'App Mobile',
    description: 'Acesse tudo no seu celular com nossa PWA otimizada.',
    color: 'info',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Shield,
    title: 'Dados Seguros',
    description: 'Seus dados são protegidos com criptografia de ponta.',
    color: 'success',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: Zap,
    title: 'Sincronização Instantânea',
    description: 'Seus dados são sincronizados em tempo real em todos os dispositivos.',
    color: 'warning',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Heart,
    title: 'Saúde em Foco',
    description: 'Foco na sua saúde e bem-estar com ferramentas profissionais.',
    color: 'destructive',
    gradient: 'from-red-500 to-red-600'
  }
]

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Recursos
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tudo que você precisa para{' '}
            <span className="text-gradient">transformar seu corpo</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma oferece todas as ferramentas necessárias para você 
            alcançar seus objetivos fitness de forma eficiente e organizada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-hover group">
                <CardHeader className="pb-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl bg-gradient-to-r from-fitness-600 to-nutrition-600 p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para começar sua transformação?
            </h3>
            <p className="text-lg text-blue-100 mb-6">
              Junte-se a milhares de pessoas que já transformaram suas vidas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="fitness" className="bg-white/20 text-white hover:bg-white/30">
                <Zap className="mr-2 h-4 w-4" />
                Setup em 2 minutos
              </Badge>
              <Badge variant="nutrition" className="bg-white/20 text-white hover:bg-white/30">
                <Shield className="mr-2 h-4 w-4" />
                100% Gratuito
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

