import { NextFunction, Request, Response } from 'express';

/**
 * Middleware de autorização por role.
 * Verifica se o role do usuário está na lista de roles permitidos.
 *
 * @param allowedRoles - Uma ou mais roles permitidos (ex: 'OWNER', 'ADMIN')
 * @returns Middleware function
 *
 * @example
 * router.delete('/:id', authorizeRole('OWNER'), deleteIngredient);
 * router.post('/', authorizeRole('OWNER', 'ADMIN'), createIngredient);
 */
export function authorizeRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.',
      });
      return;
    }

    next();
  };
}
