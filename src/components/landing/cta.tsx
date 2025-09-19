'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Zap, Shield, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <Badge variant="outline" className="mb-6 w-fit bg-white/10 text-white border-white/20">
              <Zap className="mr-2 h-4 w-4" />
              Comece Hoje Mesmo
            </Badge>
            
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Pronto para{' '}
              <span className="bg-gradient-to-r from-fitness-400 to-nutrition-400 bg-clip-text text-transparent">
                transformar
              </span>{' '}
              sua vida?
            </h2>
            
            <p className="mb-8 text-xl text-gray-300">
              Junte-se a milhares de pessoas que já transformaram seus corpos e suas vidas. 
              Comece sua jornada fitness hoje mesmo, sem compromisso.
            </p>
            
            {/* Benefits */}
            <div className="mb-8 space-y-4">
              {[
                'Setup em menos de 2 minutos',
                '100% gratuito para sempre',
                'Funciona offline no celular',
                'Dados 100% seguros e privados',
                'Suporte em português'
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <Check className="mr-3 h-5 w-5 text-fitness-400" />
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="xl"
                className="bg-fitness-600 hover:bg-fitness-700 text-white"
              >
                <Link href="/auth/signup">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/auth/signin">
                  Já tenho conta
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Dados Seguros
              </div>
              <div className="flex items-center">
                <Smartphone className="mr-2 h-4 w-4" />
                PWA Mobile
              </div>
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Sincronização Instantânea
              </div>
            </motion.div>
          </motion.div>
          
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto max-w-lg">
              {/* Main CTA Card */}
              <div className="relative z-10 rounded-2xl bg-white p-8 shadow-2xl">
                <div className="text-center">
                  <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gradient-to-r from-fitness-500 to-nutrition-500 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Comece Agora
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Crie sua conta gratuita e transforme sua vida em minutos
                  </p>
                  
                  <div className="space-y-3">
                    <div className="h-12 w-full rounded-lg bg-fitness-100 flex items-center justify-center">
                      <span className="text-fitness-700 font-semibold">Criar Conta Grátis</span>
                    </div>
                    <div className="h-12 w-full rounded-lg border border-gray-300 flex items-center justify-center">
                      <span className="text-gray-700">Já tenho conta</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-xs text-gray-500">
                    ✓ Sem cartão de crédito ✓ Sem compromisso
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-fitness-400/20 blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 h-12 w-12 rounded-full bg-nutrition-400/20 blur-sm"
              />
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 -left-8 h-6 w-6 rounded-full bg-yellow-400/20 blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

