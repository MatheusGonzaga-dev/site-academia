'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Dumbbell, 
  Apple, 
  BarChart3,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Treinos', href: '/dashboard/treino', icon: Dumbbell },
  { name: 'Dieta', href: '/dashboard/dieta', icon: Apple },
  { name: 'Progresso', href: '/dashboard/progresso', icon: BarChart3 },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 lg:hidden shadow-2xl">
      <div className="flex items-center justify-around py-3 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-0 flex-1',
                isActive 
                  ? 'text-fitness-600 dark:text-fitness-400 bg-fitness-50 dark:bg-fitness-900/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <item.icon 
                className={cn(
                  'h-5 w-5 mb-1 transition-transform duration-200',
                  isActive && 'scale-110'
                )} 
              />
              <span className={cn(
                'text-xs font-medium truncate transition-all duration-200',
                isActive && 'font-semibold'
              )}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
