import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma.js';

export interface TestTenant {
  userId: number;
  companyId: number;
  token: string;
  role: string;
}

/**
 * Cria um tenant de teste completo: user + company + userCompany + JWT.
 * Usar no beforeAll dos testes que precisam de autenticação com empresa.
 *
 * @param suffix - string única para evitar conflito de email/slug entre testes
 * @param role - papel do usuário na empresa (padrão: OWNER)
 */
export async function createTestTenant(
  suffix: string,
  role: 'OWNER' | 'ADMIN' | 'EMPLOYEE' = 'OWNER'
): Promise<TestTenant> {
  const user = await prisma.user.create({
    data: {
      name: `Test User ${suffix}`,
      email: `test_${suffix}_${Date.now()}@example.com`,
      password: 'hashed_password',
    },
  });

  const company = await prisma.company.create({
    data: {
      name: `Test Company ${suffix}`,
      slug: `test-company-${suffix}-${Date.now()}`,
    },
  });

  await prisma.userCompany.create({
    data: { userId: user.id, companyId: company.id, role },
  });

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      companyId: company.id,
      role,
    },
    secret
  );

  return {
    userId: user.id,
    companyId: company.id,
    token,
    role,
  };
}

/**
 * Remove todos os registros criados por createTestTenant.
 * Usar no afterAll dos testes.
 */
export async function cleanupTestTenant(
  userId: number,
  companyId: number
) {
  await prisma.snackPortion.deleteMany({
    where: { snack: { companyId } },
  });
  await prisma.snack.deleteMany({ where: { companyId } });
  await prisma.portion.deleteMany({ where: { companyId } });
  await prisma.ingredient.deleteMany({
    where: { companyId },
  });
  await prisma.userCompany.deleteMany({
    where: { userId },
  });
  await prisma.company
    .delete({ where: { id: companyId } })
    .catch(() => {});
  await prisma.user
    .delete({ where: { id: userId } })
    .catch(() => {});
}
