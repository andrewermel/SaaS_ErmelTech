import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import {
  createTestTenant,
  cleanupTestTenant,
  type TestTenant,
} from '../tests/helpers/createTestTenant.js';

import {
  createPortion,
  deletePortion,
  getPortion,
  listPortions,
} from './portionController.js';

describe('portionController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;
  let testIngredientId: number;
  const createdPortionIds: number[] = [];
  let tenant: TestTenant;

  beforeAll(async () => {
    tenant = await createTestTenant('portion');
    const ingredient = await prisma.ingredient.create({
      data: {
        name: 'TestIngredient_Portion_' + Date.now(),
        weightG: 1000,
        cost: 10.0,
        companyId: tenant.companyId,
      },
    });
    testIngredientId = ingredient.id;
  });

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = {
      body: {},
      user: {
        userId: tenant.userId,
        email: `test_portion@example.com`,
        companyId: tenant.companyId,
        role: tenant.role,
      },
    };
    res = { status, json } as unknown as Response;
  });

  afterAll(async () => {
    if (createdPortionIds.length > 0) {
      await prisma.portion.deleteMany({
        where: { id: { in: createdPortionIds } },
      });
    }
    if (testIngredientId) {
      await prisma.ingredient.delete({
        where: { id: testIngredientId },
      });
    }
    await cleanupTestTenant(tenant.userId, tenant.companyId);
    await prisma.$disconnect();
  });

  it('createPortion validates input', async () => {
    req.body = { name: 'P' };
    await createPortion(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('createPortion success returns 201', async () => {
    req.body = {
      ingredientId: testIngredientId,
      name: 'TestPortion_' + Date.now(),
      weightG: 100,
    };

    await createPortion(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const result = json.mock.calls[0]?.[0] as any;
    expect(result).toHaveProperty('weightG', 100);
    if (result?.id) createdPortionIds.push(result.id);
  });

  it('getPortion returns 404 when not found', async () => {
    req.params = { id: '999999' };

    await getPortion(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
  });

  it('listPortions returns array', async () => {
    await listPortions(req as Request, res as Response);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
    expect(Array.isArray(json.mock.calls[0]?.[0])).toBe(
      true
    );
  });

  it('deletePortion handles not found', async () => {
    req.params = { id: '999999' };

    await deletePortion(req as Request, res as Response);

    expect(status).toHaveBeenCalled();
  });
});
