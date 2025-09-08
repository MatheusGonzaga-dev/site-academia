import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSupabaseInit } from '@/hooks/useSupabaseInit';
import { Database, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

export function SupabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const { populateSampleData } = useSupabaseInit();

  const checkConfiguration = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (url && key && !url.includes('your-project') && !key.includes('your-anon-key')) {
      setIsConfigured(true);
    }
  };

  useState(() => {
    checkConfiguration();
  });

  if (isConfigured) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800">
            <CheckCircle className="mr-2 h-5 w-5" />
            Supabase Configurado
          </CardTitle>
          <CardDescription>
            Seu banco de dados está conectado e funcionando!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={populateSampleData} className="w-full">
            <Database className="mr-2 h-4 w-4" />
            Carregar Dados de Exemplo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          Configuração Necessária
        </CardTitle>
        <CardDescription>
          Configure o Supabase para salvar seus dados na nuvem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Passo 1: Criar projeto no Supabase</h3>
          <p className="text-sm text-muted-foreground">
            1. Acesse{' '}
            <a 
              href="https://supabase.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center"
            >
              supabase.com <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            2. Crie uma conta gratuita
          </p>
          <p className="text-sm text-muted-foreground">
            3. Crie um novo projeto
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Passo 2: Configurar banco de dados</h3>
          <p className="text-sm text-muted-foreground">
            1. Vá para SQL Editor no dashboard
          </p>
          <p className="text-sm text-muted-foreground">
            2. Execute o SQL do arquivo <code>database/schema.sql</code>
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Passo 3: Configurar variáveis</h3>
          <p className="text-sm text-muted-foreground">
            1. Copie o arquivo <code>env.example</code> para <code>.env.local</code>
          </p>
          <p className="text-sm text-muted-foreground">
            2. Preencha com suas credenciais do Supabase
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Passo 4: Deploy</h3>
          <p className="text-sm text-muted-foreground">
            Faça deploy no Vercel ou Netlify com as variáveis de ambiente
          </p>
        </div>

        <div className="pt-4 border-t">
          <Badge variant="outline" className="mb-2">
            💡 Dica: Enquanto não configurar, os dados ficam salvos localmente
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
