'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextProps {
  value: string
  setValue: (v: string) => void
}

const TabsContext = React.createContext<TabsContextProps | null>(null)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, defaultValue, children, className }: TabsProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string>(defaultValue || '')
  const current = isControlled ? (value as string) : internal

  const setValue = (v: string) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  // Se nenhum valor definido, tenta pegar primeiro TabsTrigger como default
  const initialSetRef = React.useRef(false)
  React.useEffect(() => {
    if (initialSetRef.current) return
    if (!current) {
      // noop; será definido quando um trigger montar com autoSelect
    }
    initialSetRef.current = true
  }, [current])

  return (
    <div className={className}>
      <TabsContext.Provider value={{ value: current, setValue }}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-md bg-muted text-muted-foreground p-1',
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
  const isActive = ctx.value === value || (!ctx.value && false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e)
    ctx.setValue(value)
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'px-3 py-1.5 rounded-sm text-sm transition-colors',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')
  const isActive = ctx.value === value || (!ctx.value && false)
  if (!isActive) return null
  return (
    <div role="tabpanel" className={className} {...props} />
  )
}
