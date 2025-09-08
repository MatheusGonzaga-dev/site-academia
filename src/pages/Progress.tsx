import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseStore } from '@/store/useSupabaseStore';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Scale,
  Target,
  Ruler,
  Camera
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ProgressEntry } from '@/types';

export function Progress() {
  const { progressEntries, addProgressEntry, updateProgressEntry } = useSupabaseStore();
  const [showAddEntry, setShowAddEntry] = useState(false);

  const sortedEntries = progressEntries.sort((a, b) => b.date.getTime() - a.date.getTime());
  const latestEntry = sortedEntries[0];
  const previousEntry = sortedEntries[1];

  const getWeightTrend = () => {
    if (!latestEntry || !previousEntry || !latestEntry.weight || !previousEntry.weight) {
      return { trend: 'stable', difference: 0 };
    }
    
    const difference = latestEntry.weight - previousEntry.weight;
    const trend = difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable';
    
    return { trend, difference: Math.abs(difference) };
  };

  const addNewEntry = (formData: FormData) => {
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date(formData.get('date') as string),
      weight: parseFloat(formData.get('weight') as string) || undefined,
      bodyFat: parseFloat(formData.get('bodyFat') as string) || undefined,
      measurements: {
        chest: parseFloat(formData.get('chest') as string) || undefined,
        waist: parseFloat(formData.get('waist') as string) || undefined,
        hips: parseFloat(formData.get('hips') as string) || undefined,
        arms: parseFloat(formData.get('arms') as string) || undefined,
        thighs: parseFloat(formData.get('thighs') as string) || undefined,
      },
      notes: formData.get('notes') as string || undefined
    };

    addProgressEntry(newEntry);
    setShowAddEntry(false);
  };

  const weightTrend = getWeightTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução física e conquistas
          </p>
        </div>
        <Button onClick={() => setShowAddEntry(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestEntry?.weight ? `${latestEntry.weight}kg` : '--'}
            </div>
            {weightTrend.trend !== 'stable' && (
              <p className="text-xs flex items-center mt-1">
                {weightTrend.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {weightTrend.difference.toFixed(1)}kg desde último registro
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Gordura</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestEntry?.bodyFat ? `${latestEntry.bodyFat}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestEntry ? format(latestEntry.date, "dd/MM", { locale: ptBR }) : 'Sem dados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circunferências</CardTitle>
            <Ruler className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {latestEntry?.measurements ? (
                <>
                  {latestEntry.measurements.chest && (
                    <div className="text-sm">Peito: {latestEntry.measurements.chest}cm</div>
                  )}
                  {latestEntry.measurements.waist && (
                    <div className="text-sm">Cintura: {latestEntry.measurements.waist}cm</div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">Sem medições</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de registros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Progresso</CardTitle>
          <CardDescription>
            Seus registros de evolução ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progressEntries.length > 0 ? (
            <div className="space-y-4">
              {sortedEntries.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">
                      {format(entry.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {format(entry.date, "EEEE", { locale: ptBR })}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Weight & Body Fat */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Peso & Composição</h4>
                      {entry.weight && (
                        <div className="flex justify-between">
                          <span>Peso:</span>
                          <span className="font-medium">{entry.weight}kg</span>
                        </div>
                      )}
                      {entry.bodyFat && (
                        <div className="flex justify-between">
                          <span>% Gordura:</span>
                          <span className="font-medium">{entry.bodyFat}%</span>
                        </div>
                      )}
                    </div>

                    {/* Measurements */}
                    {entry.measurements && Object.values(entry.measurements).some(val => val) && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Medidas (cm)</h4>
                        {entry.measurements.chest && (
                          <div className="flex justify-between">
                            <span>Peito:</span>
                            <span className="font-medium">{entry.measurements.chest}cm</span>
                          </div>
                        )}
                        {entry.measurements.waist && (
                          <div className="flex justify-between">
                            <span>Cintura:</span>
                            <span className="font-medium">{entry.measurements.waist}cm</span>
                          </div>
                        )}
                        {entry.measurements.arms && (
                          <div className="flex justify-between">
                            <span>Braços:</span>
                            <span className="font-medium">{entry.measurements.arms}cm</span>
                          </div>
                        )}
                        {entry.measurements.thighs && (
                          <div className="flex justify-between">
                            <span>Coxas:</span>
                            <span className="font-medium">{entry.measurements.thighs}cm</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {entry.notes && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Observações</h4>
                        <p className="text-sm">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum progresso registrado</p>
              <p className="text-muted-foreground mb-4">
                Comece a acompanhar sua evolução criando seu primeiro registro
              </p>
              <Button onClick={() => setShowAddEntry(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Primeiro Registro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Novo Registro de Progresso</CardTitle>
              <CardDescription>
                Registre suas medidas e acompanhe sua evolução
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addNewEntry(formData);
              }} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input 
                    name="date" 
                    type="date" 
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    required 
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Peso (kg)</label>
                    <Input name="weight" type="number" step="0.1" placeholder="Ex: 75.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">% Gordura Corporal</label>
                    <Input name="bodyFat" type="number" step="0.1" placeholder="Ex: 15.2" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Circunferências (cm)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Peito</label>
                      <Input name="chest" type="number" step="0.1" placeholder="Ex: 95.5" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cintura</label>
                      <Input name="waist" type="number" step="0.1" placeholder="Ex: 80.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Quadril</label>
                      <Input name="hips" type="number" step="0.1" placeholder="Ex: 95.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Braços</label>
                      <Input name="arms" type="number" step="0.1" placeholder="Ex: 35.0" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium">Coxas</label>
                    <Input name="thighs" type="number" step="0.1" placeholder="Ex: 55.0" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Observações</label>
                  <Textarea 
                    name="notes" 
                    placeholder="Como você está se sentindo? Alguma observação importante..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddEntry(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar Registro
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
