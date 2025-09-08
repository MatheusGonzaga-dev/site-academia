import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { 
  Plus, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Apple,
  Droplet,
  Target,
  TrendingUp
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DietEntry, Meal } from '@/types';

export function Diet() {
  const { dietEntries, addDietEntry, updateDietEntry } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');

  const selectedDietEntry = dietEntries.find(entry => 
    format(entry.date, 'yyyy-MM-dd') === selectedDate
  );

  const createTodayEntry = () => {
    if (!selectedDietEntry) {
      const newEntry: DietEntry = {
        id: Date.now().toString(),
        date: new Date(selectedDate),
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        waterIntake: 0
      };
      addDietEntry(newEntry);
      return newEntry;
    }
    return selectedDietEntry;
  };

  const addMealToEntry = (meal: Meal, mealType: keyof DietEntry['meals']) => {
    const entry = createTodayEntry();
    const updatedMeals = {
      ...entry.meals,
      [mealType]: [...entry.meals[mealType], meal]
    };
    
    updateDietEntry(entry.id, { meals: updatedMeals });
  };

  const updateWaterIntake = (amount: number) => {
    const entry = createTodayEntry();
    updateDietEntry(entry.id, { waterIntake: entry.waterIntake + amount });
  };

  const getTotalNutrients = () => {
    if (!selectedDietEntry) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
    
    const allMeals = Object.values(selectedDietEntry.meals).flat();
    return allMeals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const mealIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snacks: Apple
  };

  const mealNames = {
    breakfast: 'Café da Manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snacks: 'Lanches'
  };

  const totals = getTotalNutrients();
  const waterGoal = 3000; // ml
  const calorieGoal = 2500;
  const proteinGoal = 150; // g

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minha Dieta</h1>
          <p className="text-muted-foreground">
            Acompanhe sua alimentação e hidratação
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Nutrition Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calorias</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.calories.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totals.calories / calorieGoal) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{calorieGoal}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proteína</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.protein.toFixed(0)}g</div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((totals.protein / proteinGoal) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{proteinGoal}g</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carboidratos</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.carbs.toFixed(0)}g</div>
            <p className="text-xs text-muted-foreground">
              {((totals.carbs * 4 / totals.calories) * 100 || 0).toFixed(0)}% das calorias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Água</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((selectedDietEntry?.waterIntake || 0) / 1000).toFixed(1)}L
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(((selectedDietEntry?.waterIntake || 0) / waterGoal) * 100, 100)}%` 
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">3.0L</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Intake */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplet className="mr-2 h-5 w-5 text-blue-500" />
            Hidratação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Adicionar:</span>
            <Button variant="outline" size="sm" onClick={() => updateWaterIntake(250)}>
              +250ml
            </Button>
            <Button variant="outline" size="sm" onClick={() => updateWaterIntake(500)}>
              +500ml
            </Button>
            <Button variant="outline" size="sm" onClick={() => updateWaterIntake(1000)}>
              +1L
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="grid gap-6 md:grid-cols-2">
        {(Object.keys(mealNames) as Array<keyof typeof mealNames>).map(mealType => {
          const Icon = mealIcons[mealType];
          const meals = selectedDietEntry?.meals[mealType] || [];
          const mealTotals = meals.reduce((totals, meal) => ({
            calories: totals.calories + meal.calories,
            protein: totals.protein + meal.protein
          }), { calories: 0, protein: 0 });

          return (
            <Card key={mealType}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {mealNames[mealType]}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedMealType(mealType);
                      setShowAddMeal(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
                <CardDescription>
                  {mealTotals.calories} kcal • {mealTotals.protein.toFixed(0)}g proteína
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meals.length > 0 ? (
                  <div className="space-y-2">
                    {meals.map(meal => (
                      <div key={meal.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{meal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {meal.quantity}{meal.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{meal.calories} kcal</p>
                          <p className="text-sm text-muted-foreground">
                            {meal.protein}g prot.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum alimento adicionado
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Adicionar Alimento</CardTitle>
              <CardDescription>
                {mealNames[selectedMealType]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const newMeal: Meal = {
                  id: Date.now().toString(),
                  name: formData.get('name') as string,
                  calories: parseFloat(formData.get('calories') as string) || 0,
                  protein: parseFloat(formData.get('protein') as string) || 0,
                  carbs: parseFloat(formData.get('carbs') as string) || 0,
                  fats: parseFloat(formData.get('fats') as string) || 0,
                  quantity: parseFloat(formData.get('quantity') as string) || 1,
                  unit: formData.get('unit') as string
                };

                addMealToEntry(newMeal, selectedMealType);
                setShowAddMeal(false);
              }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome do Alimento</label>
                  <Input name="name" placeholder="Ex: Peito de frango grelhado" required />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input name="quantity" type="number" step="0.1" defaultValue="100" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unidade</label>
                    <Input name="unit" placeholder="g, ml, unidade" defaultValue="g" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Calorias</label>
                    <Input name="calories" type="number" step="0.1" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Proteína (g)</label>
                    <Input name="protein" type="number" step="0.1" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium">Carboidratos (g)</label>
                    <Input name="carbs" type="number" step="0.1" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gorduras (g)</label>
                    <Input name="fats" type="number" step="0.1" required />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddMeal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
