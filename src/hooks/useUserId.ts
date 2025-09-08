import { useState, useEffect } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Verificar se já existe um userId salvo
    const savedUserId = localStorage.getItem('academia-user-id');
    
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      // Gerar um novo UUID e salvar
      const newUserId = crypto.randomUUID();
      localStorage.setItem('academia-user-id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  return userId;
}
