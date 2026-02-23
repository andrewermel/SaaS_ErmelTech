import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

import {
  createIngredient,
  getIngredient,
  listIngredients,
} from './ingredientController.js';

describe('ingredientController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;
  const createdIds: number[] = [];

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = { body: {} };
    res = { status, json } as unknown as Response;
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await prisma.ingredient.deleteMany({
        where: { id: { in: createdIds } },
      });
    }
    await prisma.$disconnect();
  });

  it('createIngredient returns 400 when weight is zero', async () => {
    req.body = { name: 'X', weightG: 0, cost: 50 };
    await createIngredient(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalled();
  });

  it('createIngredient success returns 201 with created ingredient', async () => {
    req.body = {
      name: 'TestIngredient_' + Date.now(),
      weightG: 1000,
      cost: 24,
    };

    await createIngredient(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const result = json.mock.calls[0]?.[0] as any;
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('weightG', 1000);
    if (result?.id) createdIds.push(result.id);
  });

  it('getIngredient returns 404 when not found', async () => {
    req.params = { id: '999999' };

    await getIngredient(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      error: 'Not found.',
    });
  });

  it('listIngredients returns array', async () => {
    await listIngredients({} as Request, res as Response);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
    expect(Array.isArray(json.mock.calls[0]?.[0])).toBe(
      true
    );
  });
});
