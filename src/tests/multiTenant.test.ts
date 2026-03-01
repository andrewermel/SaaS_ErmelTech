import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import {
  createTestTenant,
  cleanupTestTenant,
  type TestTenant,
} from './helpers/createTestTenant.js';
import {
  createIngredient,
  listIngredients,
  deleteIngredient,
} from '../controllers/ingredientController.js';

describe('Multi-tenant isolation', () => {
  let tenantA: TestTenant;
  let tenantB: TestTenant;
  let ingredientIdA: number;
  const createdIds: number[] = [];

  beforeAll(async () => {
    // Criar dois tenants completamente separados
    tenantA = await createTestTenant('tenant-a');
    tenantB = await createTestTenant('tenant-b');

    // Criar um ingrediente para tenantA
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const req = {
      body: { name: 'Secret Ingredient A', weightG: 500, cost: 30 },
      user: {
        userId: tenantA.userId,
        email: tenantA.token,
        companyId: tenantA.companyId,
        role: tenantA.role,
      },
    } as unknown as Request;
    const res = { status, json } as unknown as Response;

    await createIngredient(req, res);
    const result = json.mock.calls[0]?.[0] as any;
    ingredientIdA = result?.id;
    if (ingredientIdA) createdIds.push(ingredientIdA);
  });

  afterAll(async () => {
    await cleanupTestTenant(tenantA.userId, tenantA.companyId);
    await cleanupTestTenant(tenantB.userId, tenantB.companyId);
    await prisma.$disconnect();
  });

  it('TenantB não vê ingredientes de TenantA na lista', async () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const req = {
      user: {
        userId: tenantB.userId,
        email: tenantB.token,
        companyId: tenantB.companyId,
        role: tenantB.role,
      },
    } as unknown as Request;
    const res = { status, json } as unknown as Response;

    await listIngredients(req, res);

    const result = json.mock.calls[0]?.[0] as any[];
    expect(Array.isArray(result)).toBe(true);

    // Verificar que ingrediente de A NÃO está na lista de B
    const ingredientFromA = result?.find(
      (ing: any) => ing.id === ingredientIdA
    );
    expect(ingredientFromA).toBeUndefined();
  });

  it('TenantA vê seu próprio ingrediente', async () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const req = {
      user: {
        userId: tenantA.userId,
        email: tenantA.token,
        companyId: tenantA.companyId,
        role: tenantA.role,
      },
    } as unknown as Request;
    const res = { status, json } as unknown as Response;

    await listIngredients(req, res);

    const result = json.mock.calls[0]?.[0] as any[];
    expect(Array.isArray(result)).toBe(true);

    // Deve conter o ingrediente criado por A
    const ingredientFromA = result?.find(
      (ing: any) => ing.id === ingredientIdA
    );
    expect(ingredientFromA).toBeDefined();
    expect(ingredientFromA?.name).toBe('Secret Ingredient A');
  });

  it('TenantB não consegue deletar ingrediente de TenantA (404)', async () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const req = {
      params: { id: ingredientIdA.toString() },
      user: {
        userId: tenantB.userId,
        email: tenantB.token,
        companyId: tenantB.companyId,
        role: tenantB.role,
      },
    } as unknown as Request;
    const res = { status, json } as unknown as Response;

    await deleteIngredient(req, res);

    // Deve retornar 404 (ingrediente não existe para essa empresa)
    expect(status).toHaveBeenCalledWith(404);
  });
});
