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
import '../../../styles/bottom-nav.css'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Treinos', href: '/dashboard/treino', icon: Dumbbell },
  { name: 'Dieta', href: '/dashboard/dieta', icon: Apple },
  { name: 'Progresso', href: '/dashboard/progresso', icon: BarChart3 },
  { name: 'Perfil', href: '/dashboard/perfil', icon: User },
]

export function BottomNavFixed() {
  const pathname = usePathname()

  return (
    <div className="mobile-bottom-nav">
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
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
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
