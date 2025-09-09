// Função para limpar todos os dados armazenados localmente
export function resetLocalData() {
  // Limpar localStorage
  localStorage.removeItem('academia-app-storage');
  localStorage.removeItem('academia-user-id');
  
  // Recarregar página para reinicializar o estado
  window.location.reload();
}

// Função para verificar se há dados duplicados
export function hasDuplicateData(workouts: any[]) {
  const ids = workouts.map(w => w.id);
  const uniqueIds = new Set(ids);
  return ids.length !== uniqueIds.size;
}
