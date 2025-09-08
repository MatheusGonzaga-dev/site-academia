import { useState, useEffect } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string>('demo-user');

  useEffect(() => {
    // Verificar se já existe um userId salvo
    const savedUserId = localStorage.getItem('academia-user-id');
    
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      // Usar um ID simples para demo
      const newUserId = 'demo-user';
      localStorage.setItem('academia-user-id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  return userId;
}
