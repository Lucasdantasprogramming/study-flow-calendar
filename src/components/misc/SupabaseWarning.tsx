
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SupabaseWarning = () => {
  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4 mt-1" />
        <AlertTitle>Configuração do Supabase necessária</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Este aplicativo está em modo de demonstração usando dados fictícios pois as variáveis de ambiente do Supabase não foram configuradas.
          </p>
          <p className="mb-4 text-sm">
            Para permitir login real e armazenamento de dados, conecte seu projeto Lovable ao Supabase.
          </p>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => window.open('https://docs.lovable.dev/integrations/supabase/', '_blank')}
            >
              Como configurar
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
