'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Maria Silva',
    role: 'Personal Trainer',
    avatar: '/avatars/maria.jpg',
    content: 'Incrível como o app me ajudou a organizar meus treinos e dieta. Perdi 15kg em 6 meses seguindo as sugestões da plataforma!',
    rating: 5,
    result: 'Perdeu 15kg'
  },
  {
    name: 'João Santos',
    role: 'Empresário',
    avatar: '/avatars/joao.jpg',
    content: 'Como empresário, não tinha tempo para me organizar. O app me permitiu ter controle total da minha rotina fitness.',
    rating: 5,
    result: 'Ganhou 8kg de massa'
  },
  {
    name: 'Ana Costa',
    role: 'Estudante',
    avatar: '/avatars/ana.jpg',
    content: 'Interface super intuitiva e fácil de usar. Consigo acompanhar meu progresso e me manter motivada todos os dias.',
    rating: 5,
    result: 'Melhorou 40% no treino'
  },
  {
    name: 'Carlos Oliveira',
    role: 'Aposentado',
    avatar: '/avatars/carlos.jpg',
    content: 'Aos 65 anos, nunca pensei que conseguiria me organizar tão bem. O app me deu uma nova perspectiva sobre saúde.',
    rating: 5,
    result: 'Recuperou mobilidade'
  },
  {
    name: 'Fernanda Lima',
    role: 'Mãe de 3 filhos',
    avatar: '/avatars/fernanda.jpg',
    content: 'Mesmo com a correria da maternidade, consegui me organizar e voltar ao shape. O app é perfeito para mães ocupadas!',
    rating: 5,
    result: 'Voltou ao peso ideal'
  },
  {
    name: 'Roberto Alves',
    role: 'Atleta',
    avatar: '/avatars/roberto.jpg',
    content: 'Como atleta, preciso de precisão nos meus treinos. O app me dá controle total e me ajuda a evoluir constantemente.',
    rating: 5,
    result: 'Melhorou performance'
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Depoimentos
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            O que nossos usuários{' '}
            <span className="text-gradient">dizem sobre nós</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Histórias reais de pessoas que transformaram suas vidas com nossa plataforma.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-hover group">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-fitness-600" />
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-4 flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <blockquote className="mb-6 text-gray-700">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Result Badge */}
                  <div className="mb-4">
                    <Badge variant="fitness" className="text-sm">
                      {testimonial.result}
                    </Badge>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-fitness-500 to-nutrition-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <div className="text-6xl font-bold text-fitness-600">4.9</div>
              <div className="ml-4 text-left">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Baseado em 2.500+ avaliações
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Avaliação Excelente
            </h3>
            <p className="text-gray-600">
              Nossos usuários nos avaliam com 4.9 estrelas em média
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

