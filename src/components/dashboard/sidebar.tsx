'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dumbbell, 
  Apple, 
  BarChart3, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Target,
  Users,
  Bell
} from 'lucide-react'
import { useAuth } from '@/components/providers'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Treinos', href: '/dashboard/treino', icon: Dumbbell },
  { name: 'Exercícios', href: '/dashboard/exercicios', icon: Target },
  { name: 'Dieta', href: '/dashboard/dieta', icon: Apple },
  { name: 'Progresso', href: '/dashboard/progresso', icon: BarChart3 },
  { name: 'Planejamento', href: '/dashboard/planejamento', icon: Calendar },
  { name: 'Metas', href: '/dashboard/metas', icon: Target },
  { name: 'Comunidade', href: '/dashboard/comunidade', icon: Users },
]

const bottomNavigation = [
  { name: 'Notificações', href: '/dashboard/notificacoes', icon: Bell },
  { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
  { name: 'Admin - Dias', href: '/dashboard/admin/dias', icon: Calendar },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const activeItemClasses = 'bg-fitness-600/15 text-foreground border-l-2 border-fitness-500 dark:text-white';
  const inactiveItemClasses = 'text-muted-foreground hover:bg-muted hover:text-foreground';
  const activeIconClasses = 'text-fitness-400';
  const inactiveIconClasses = 'text-muted-foreground group-hover:text-foreground';

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-fitness-600 to-nutrition-600">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Academia</span>
        </Link>
        
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fitness-500 to-nutrition-500 flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                isActive ? activeItemClasses : inactiveItemClasses
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? activeIconClasses : inactiveIconClasses
                )}
              />
              {item.name}
              {item.name === 'Treinos' && (
                <Badge variant="fitness" className="ml-auto text-xs">
                  3
                </Badge>
              )}
              {item.name === 'Dieta' && (
                <Badge variant="nutrition" className="ml-auto text-xs">
                  4
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-border space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                isActive ? activeItemClasses : inactiveItemClasses
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? activeIconClasses : inactiveIconClasses
                )}
              />
              {item.name}
              {item.name === 'Notificações' && (
                <Badge variant="destructive" className="ml-auto text-xs">
                  2
                </Badge>
              )}
            </Link>
          )
        })}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-background border-border shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  )
}

