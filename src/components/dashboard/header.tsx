'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Moon,
  Sun,
  HelpCircle,
  Menu
} from 'lucide-react'
import { useAuth } from '@/components/providers'
import { motion } from 'framer-motion'

export function DashboardHeader() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Carregar tema salvo
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const prefersDark = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDarkMode(shouldUseDark)
    const root = document.documentElement
    if (shouldUseDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !isDarkMode
    setIsDarkMode(next)
    if (next) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const notifications = [
    { id: 1, title: 'Hora do treino!', time: '2 min atrás', unread: true },
    { id: 2, title: 'Meta semanal atingida!', time: '1 hora atrás', unread: true },
    { id: 3, title: 'Lembrete: registrar refeição', time: '3 horas atrás', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Search - apenas no desktop */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar treinos, exercícios, refeições..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Logo no mobile */}
        <div className="flex-1 sm:hidden">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Academia Fitness
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button - apenas no mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Função será passada via props ou context
              const event = new CustomEvent('toggleMobileMenu')
              window.dispatchEvent(event)
            }}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Dark mode toggle - sempre visível */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Help - apenas no desktop */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                </motion.div>
              )}
            </Button>
          </div>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-fitness-500 to-nutrition-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search - removido */}
    </header>
  )
}

