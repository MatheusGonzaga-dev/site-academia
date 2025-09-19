'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Apple,
  Search,
  X,
  Calculator
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabase-client'
import { formatCalories, formatMacros } from '@/lib/utils'

interface Product {
  id: string
  nome: string
  marca: string
  quantidade_g: number
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
}

const refeicoes = [
  { id: 1, nome: 'Café da manhã', ordem: 1, icon: '🌅' },
  { id: 2, nome: 'Lanche da manhã', ordem: 2, icon: '🍎' },
  { id: 3, nome: 'Almoço', ordem: 3, icon: '🍽️' },
  { id: 4, nome: 'Lanche da tarde', ordem: 4, icon: '🥜' },
  { id: 5, nome: 'Jantar', ordem: 5, icon: '🌙' },
  { id: 6, nome: 'Ceia', ordem: 6, icon: '🌃' },
]

const produtosDisponiveis = [
  { id: '1', nome: 'Aveia', marca: 'Quaker', calorias_por_100g: 380, proteinas_por_100g: 14, carboidratos_por_100g: 68, gorduras_por_100g: 6 },
  { id: '2', nome: 'Banana', marca: '', calorias_por_100g: 89, proteinas_por_100g: 1, carboidratos_por_100g: 23, gorduras_por_100g: 0 },
  { id: '3', nome: 'Leite Desnatado', marca: 'Nestlé', calorias_por_100g: 35, proteinas_por_100g: 3.5, carboidratos_por_100g: 5, gorduras_por_100g: 0 },
  { id: '4', nome: 'Whey Protein', marca: 'Growth', calorias_por_100g: 400, proteinas_por_100g: 80, carboidratos_por_100g: 6, gorduras_por_100g: 3 },
  { id: '5', nome: 'Frango Grelhado', marca: '', calorias_por_100g: 165, proteinas_por_100g: 31, carboidratos_por_100g: 0, gorduras_por_100g: 3.6 },
  { id: '6', nome: 'Arroz Integral', marca: '', calorias_por_100g: 110, proteinas_por_100g: 2.5, carboidratos_por_100g: 23, gorduras_por_100g: 0.9 },
  { id: '7', nome: 'Brócolis', marca: '', calorias_por_100g: 34, proteinas_por_100g: 2.8, carboidratos_por_100g: 7, gorduras_por_100g: 0.4 },
  { id: '8', nome: 'Iogurte Grego', marca: 'Vigor', calorias_por_100g: 87, proteinas_por_100g: 10, carboidratos_por_100g: 4, gorduras_por_100g: 2.7 },
  { id: '9', nome: 'Ovo', marca: '', calorias_por_100g: 155, proteinas_por_100g: 13, carboidratos_por_100g: 1.1, gorduras_por_100g: 11 },
  { id: '10', nome: 'Abacate', marca: '', calorias_por_100g: 160, proteinas_por_100g: 2, carboidratos_por_100g: 9, gorduras_por_100g: 15 },
]

export default function RegistrarRefeicaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedMeal, setSelectedMeal] = useState<number>(
    parseInt(searchParams.get('refeicao') || '1')
  )
  const [produtos, setProdutos] = useState<Product[]>([])
  const [searchProduct, setSearchProduct] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [loading, setLoading] = useState(false)
  // supabase já está importado

  const filteredProducts = produtosDisponiveis.filter(product =>
    product.nome.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchProduct.toLowerCase())
  )

  const addProduct = (product: any) => {
    const newProduct: Product = {
      id: product.id,
      nome: product.nome,
      marca: product.marca,
      quantidade_g: 100,
      calorias: product.calorias_por_100g,
      proteinas: product.proteinas_por_100g,
      carboidratos: product.carboidratos_por_100g,
      gorduras: product.gorduras_por_100g
    }
    
    setProdutos(prev => [...prev, newProduct])
    setShowProductModal(false)
    setSearchProduct('')
    toast.success('Produto adicionado!')
  }

  const removeProduct = (index: number) => {
    setProdutos(prev => prev.filter((_, i) => i !== index))
    toast.success('Produto removido!')
  }

  const updateProductQuantity = (index: number, quantity: number) => {
    const product = produtos[index]
    const baseProduct = produtosDisponiveis.find(p => p.id === product.id)
    
    if (baseProduct) {
      const multiplier = quantity / 100
      setProdutos(prev => prev.map((p, i) => 
        i === index ? {
          ...p,
          quantidade_g: quantity,
          calorias: baseProduct.calorias_por_100g * multiplier,
          proteinas: baseProduct.proteinas_por_100g * multiplier,
          carboidratos: baseProduct.carboidratos_por_100g * multiplier,
          gorduras: baseProduct.gorduras_por_100g * multiplier
        } : p
      ))
    }
  }

  const totalCalories = produtos.reduce((sum, product) => sum + product.calorias, 0)
  const totalProtein = produtos.reduce((sum, product) => sum + product.proteinas, 0)
  const totalCarbs = produtos.reduce((sum, product) => sum + product.carboidratos, 0)
  const totalFat = produtos.reduce((sum, product) => sum + product.gorduras, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (produtos.length === 0) {
      toast.error('Adicione pelo menos um produto')
      return
    }

    setLoading(true)

    try {
      // Simular salvamento da refeição
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Refeição registrada com sucesso!')
      router.push('/dashboard/dieta')
    } catch (error) {
      toast.error('Erro ao registrar refeição')
    } finally {
      setLoading(false)
    }
  }

  const selectedMealData = refeicoes.find(r => r.ordem === selectedMeal)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/dieta">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registrar Refeição</h1>
          <p className="text-gray-600 mt-1">
            Adicione produtos à sua refeição
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meal Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Apple className="mr-2 h-5 w-5" />
                Selecionar Refeição
              </CardTitle>
              <CardDescription>
                Escolha qual refeição você está registrando
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {refeicoes.map((refeicao) => (
                  <Button
                    key={refeicao.id}
                    type="button"
                    variant={selectedMeal === refeicao.ordem ? 'default' : 'outline'}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setSelectedMeal(refeicao.ordem)}
                  >
                    <div className="text-2xl">{refeicao.icon}</div>
                    <div className="text-sm font-medium">{refeicao.nome}</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" />
                    Produtos ({produtos.length})
                  </CardTitle>
                  <CardDescription>
                    Adicione produtos à sua refeição
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {produtos.length === 0 ? (
                <div className="text-center py-8">
                  <Apple className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum produto adicionado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Adicione produtos para registrar sua refeição
                  </p>
                  <Button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {produtos.map((produto, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{produto.nome}</h4>
                          {produto.marca && (
                            <p className="text-sm text-gray-600">{produto.marca}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Quantidade (g)</label>
                          <Input
                            type="number"
                            value={produto.quantidade_g}
                            onChange={(e) => updateProductQuantity(index, parseFloat(e.target.value) || 0)}
                            min="1"
                            step="1"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Calorias</label>
                          <div className="text-sm font-medium text-orange-600 p-2 bg-orange-50 rounded">
                            {formatCalories(produto.calorias)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Proteínas</label>
                          <div className="text-sm font-medium text-red-600 p-2 bg-red-50 rounded">
                            {formatMacros(produto.proteinas)}g
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Carboidratos</label>
                          <div className="text-sm font-medium text-blue-600 p-2 bg-blue-50 rounded">
                            {formatMacros(produto.carboidratos)}g
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-600">Gorduras</label>
                          <div className="text-sm font-medium text-green-600 p-2 bg-green-50 rounded">
                            {formatMacros(produto.gorduras)}g
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary */}
        {produtos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-nutrition-50 to-nutrition-100 border-nutrition-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Resumo da Refeição
                </CardTitle>
                <CardDescription>
                  {selectedMealData?.icon} {selectedMealData?.nome}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCalories(totalCalories)}
                    </div>
                    <div className="text-sm text-gray-600">Calorias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {formatMacros(totalProtein)}g
                    </div>
                    <div className="text-sm text-gray-600">Proteínas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatMacros(totalCarbs)}g
                    </div>
                    <div className="text-sm text-gray-600">Carboidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatMacros(totalFat)}g
                    </div>
                    <div className="text-sm text-gray-600">Gorduras</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end space-x-4"
        >
          <Button asChild variant="outline">
            <Link href="/dashboard/dieta">
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={loading || produtos.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Registrar Refeição'}
          </Button>
        </motion.div>
      </form>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Adicionar Produto</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProductModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => addProduct(product)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.nome}</h4>
                      {product.marca && (
                        <p className="text-sm text-gray-600">{product.marca}</p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{product.calorias_por_100g} cal/100g</span>
                        <span>•</span>
                        <span>{product.proteinas_por_100g}g proteína</span>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
