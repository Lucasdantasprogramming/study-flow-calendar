
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setTimeout(() => navigate('/login'), 3000);
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError("Erro de autenticação");
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      {error ? (
        <div className="max-w-md w-full bg-white/50 backdrop-blur-md p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-600 text-2xl mb-4">Erro de Autenticação</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecionando para a página de login...</p>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white/50 backdrop-blur-md p-8 rounded-lg shadow-lg text-center">
          <div className="text-2xl font-bold mb-4">Autenticando...</div>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
