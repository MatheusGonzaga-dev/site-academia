import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatWeight(weight: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(weight)
}

export function formatCalories(calories: number) {
  return new Intl.NumberFormat('pt-BR').format(calories)
}

export function formatMacros(macro: number) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(macro)
}

export function calculateBMI(weight: number, height: number) {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-600' }
  if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' }
  if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' }
  return { category: 'Obesidade', color: 'text-red-600' }
}

export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: 'masculino' | 'feminino' | 'outro',
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'muito_ativo'
) {
  // Fórmula de Mifflin-St Jeor
  let bmr: number
  
  if (gender === 'masculino') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }
  
  const activityMultipliers = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    ativo: 1.725,
    muito_ativo: 1.9,
  }
  
  return Math.round(bmr * activityMultipliers[activityLevel])
}

export function calculateMacros(
  calories: number,
  goal: 'perda_peso' | 'ganho_massa' | 'manutencao' | 'resistencia'
) {
  let proteinRatio = 0.25
  let carbRatio = 0.45
  let fatRatio = 0.30
  
  switch (goal) {
    case 'perda_peso':
      proteinRatio = 0.30
      carbRatio = 0.40
      fatRatio = 0.30
      break
    case 'ganho_massa':
      proteinRatio = 0.25
      carbRatio = 0.50
      fatRatio = 0.25
      break
    case 'resistencia':
      proteinRatio = 0.20
      carbRatio = 0.60
      fatRatio = 0.20
      break
  }
  
  return {
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function getWeekDates(date: Date = new Date()) {
  const startOfWeek = new Date(date)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Ajusta para segunda-feira
  startOfWeek.setDate(diff)
  
  const weekDates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date)
  }
  
  return weekDates
}

export function getDayName(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date)
}

export function getShortDayName(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date)
}

export function isToday(date: Date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isThisWeek(date: Date) {
  const today = new Date()
  const weekDates = getWeekDates(today)
  return weekDates.some(weekDate => weekDate.toDateString() === date.toDateString())
}

export function getRelativeTime(date: Date | string) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'agora'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`
  
  return formatDate(targetDate)
}

