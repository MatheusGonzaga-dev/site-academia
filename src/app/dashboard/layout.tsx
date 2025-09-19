'use client'

import { useAuth } from '@/components/providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingPage } from '@/components/ui/loading-spinner'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { BottomNav } from '@/components/dashboard/bottom-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingPage />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="py-6 pb-20 lg:pb-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

