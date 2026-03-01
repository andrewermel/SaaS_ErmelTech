import { useAuth } from '../contexts/AuthContext';

/**
 * Hook para controlar permissões de UI baseado no role do usuário
 * Retorna flags booleanas indicando se o usuário pode criar, editar ou deletar
 *
 * Matriz de permissões:
 * - OWNER: pode criar, editar e deletar (acesso total)
 * - ADMIN: pode criar e editar, mas NÃO pode deletar
 * - EMPLOYEE: apenas leitura (pode visualizar, mas não pode criar, editar ou deletar)
 */
export function usePermission() {
  const { user } = useAuth();

  return {
    canCreate: ['OWNER', 'ADMIN'].includes(user?.role),
    canEdit: ['OWNER', 'ADMIN'].includes(user?.role),
    canDelete: user?.role === 'OWNER',
    userRole: user?.role,
  };
}
