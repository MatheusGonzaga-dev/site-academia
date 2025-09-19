import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Validação das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrada')
  console.error('📝 Verifique se o arquivo .env.local existe e contém:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada')
  console.error('📝 Verifique se o arquivo .env.local existe e contém:')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui')
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

console.log('✅ Supabase configurado com sucesso!')
console.log(`🔗 URL: ${supabaseUrl}`)

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
