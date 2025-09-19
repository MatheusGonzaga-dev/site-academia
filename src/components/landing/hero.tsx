'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-fitness-600 via-fitness-700 to-fitness-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="fitness" className="mb-6 w-fit bg-white/10 text-white hover:bg-white/20">
                <Star className="mr-2 h-4 w-4" />
                #1 App de Fitness do Brasil
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Transforme seu{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  corpo
                </span>{' '}
                e sua{' '}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  vida
                </span>
              </h1>
              
              <p className="mb-8 text-xl text-blue-100 lg:text-2xl">
                Gerencie treinos, monitore sua dieta e acompanhe seu progresso de forma inteligente. 
                Alcance seus objetivos fitness com a tecnologia mais avançada.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="xl"
                className="bg-white text-fitness-700 hover:bg-gray-100"
              >
                <Link href="/auth/signup">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo
                </Link>
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-blue-200">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-sm text-blue-200">Treinos Realizados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-blue-200">Avaliação</div>
              </div>
            </motion.div>
          </div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-lg">
              {/* Phone Mockup */}
              <div className="relative z-10 mx-auto h-[600px] w-[300px] rounded-[3rem] bg-gray-900 p-2 shadow-2xl">
                <div className="h-full w-full rounded-[2.5rem] bg-white overflow-hidden">
                  {/* App Preview */}
                  <div className="h-full bg-gradient-to-b from-fitness-50 to-nutrition-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-8 w-8 rounded-full bg-fitness-600"></div>
                      <div className="text-sm font-semibold text-gray-700">Academia Fitness</div>
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 rounded bg-fitness-200"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="h-16 rounded-lg bg-gradient-to-r from-fitness-100 to-fitness-200 p-3">
                          <div className="h-3 w-2/3 rounded bg-fitness-300 mb-2"></div>
                          <div className="h-2 w-1/3 rounded bg-fitness-400"></div>
                        </div>
                        <div className="h-16 rounded-lg bg-gradient-to-r from-nutrition-100 to-nutrition-200 p-3">
                          <div className="h-3 w-2/3 rounded bg-nutrition-300 mb-2"></div>
                          <div className="h-2 w-1/3 rounded bg-nutrition-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-4 top-20 h-16 w-16 rounded-full bg-yellow-400/20 blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-4 top-40 h-20 w-20 rounded-full bg-green-400/20 blur-xl"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 left-10 h-12 w-12 rounded-full bg-blue-400/20 blur-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

