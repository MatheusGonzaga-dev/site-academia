import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SupabaseSetup } from '@/components/SupabaseSetup';
import { resetLocalData } from '@/utils/resetData';
import { 
  Settings as SettingsIcon, 
  User, 
  Target, 
  Bell, 
  Database,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export function Settings() {
  const handleExportData = () => {
    const data = {
      workouts: JSON.parse(localStorage.getItem('academia-app-storage') || '{}'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minha-academia-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('academia-app-storage');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência e gerencie seus dados
        </p>
      </div>

      {/* Supabase Setup */}
      <SupabaseSetup />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>
              Suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input defaultValue="Matheus" />
            </div>
            <div>
              <label className="text-sm font-medium">Idade</label>
              <Input type="number" placeholder="Ex: 25" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Altura (cm)</label>
                <Input type="number" placeholder="Ex: 175" />
              </div>
              <div>
                <label className="text-sm font-medium">Nível de Atividade</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Sedentário</option>
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Intenso</option>
                  <option>Muito Intenso</option>
                </select>
              </div>
            </div>
            <Button>Salvar Perfil</Button>
          </CardContent>
        </Card>

        {/* Goals Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Metas
            </CardTitle>
            <CardDescription>
              Configure suas metas de treino e dieta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meta de Peso (kg)</label>
              <Input type="number" step="0.1" placeholder="Ex: 75.0" />
            </div>
            <div>
              <label className="text-sm font-medium">Calorias Diárias</label>
              <Input type="number" defaultValue="2500" />
            </div>
            <div>
              <label className="text-sm font-medium">Proteína Diária (g)</label>
              <Input type="number" defaultValue="150" />
            </div>
            <div>
              <label className="text-sm font-medium">Água Diária (L)</label>
              <Input type="number" step="0.1" defaultValue="3.0" />
            </div>
            <Button>Salvar Metas</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure lembretes e alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lembrete de Treino</p>
                <p className="text-sm text-muted-foreground">Receba lembretes dos treinos programados</p>
              </div>
              <Badge variant="secondary">Em breve</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lembrete de Hidratação</p>
                <p className="text-sm text-muted-foreground">Lembretes para beber água</p>
              </div>
              <Badge variant="secondary">Em breve</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Resumo Semanal</p>
                <p className="text-sm text-muted-foreground">Relatório semanal do seu progresso</p>
              </div>
              <Badge variant="secondary">Em breve</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Dados
            </CardTitle>
            <CardDescription>
              Gerencie seus dados e faça backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Seus dados são armazenados localmente no seu navegador. 
                Faça backup regularmente para não perder suas informações.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="w-full justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados (Backup)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <Upload className="mr-2 h-4 w-4" />
                Importar Dados
                <Badge variant="secondary" className="ml-auto">Em breve</Badge>
              </Button>
            </div>

            <hr />

            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive">Zona de Perigo</p>
              
              <Button 
                variant="outline" 
                onClick={resetLocalData}
                className="w-full justify-start"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Dados Locais (localStorage)
              </Button>
              <p className="text-xs text-muted-foreground">
                Remove dados duplicados do navegador. Mantém dados do Supabase.
              </p>
              
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="w-full justify-start"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar Todos os Dados
              </Button>
              <p className="text-xs text-muted-foreground">
                Esta ação não pode ser desfeita. Certifique-se de fazer backup antes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">💪</p>
              <p className="font-medium">Minha Academia</p>
              <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">🚀</p>
              <p className="font-medium">Tecnologias</p>
              <p className="text-sm text-muted-foreground">React, TypeScript, Tailwind</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">📱</p>
              <p className="font-medium">Responsivo</p>
              <p className="text-sm text-muted-foreground">Funciona em todos os dispositivos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
