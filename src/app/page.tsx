import { Suspense } from 'react'
import { Metadata } from 'next'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Stats } from '@/components/landing/stats'
import { Testimonials } from '@/components/landing/testimonials'
import { CTA } from '@/components/landing/cta'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata: Metadata = {
  title: 'Academia Fitness - Treino e Dieta Inteligente',
  description: 'Gerencie seus treinos e dieta de forma inteligente. Acompanhe seu progresso, monitore suas refeições e alcance seus objetivos fitness.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fitness-50 to-nutrition-50">
      <Header />
      
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Hero />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Features />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Stats />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <CTA />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}

