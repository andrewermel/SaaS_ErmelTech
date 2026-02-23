import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import type { SnackWithTotals } from '../types/entities.js';

// Defina assinaturas de funções sem `any`
type CreateSnackFn = (
  name: string,
  imageUrl?: string
) => Promise<{
  id: number;
  name: string;
  imageUrl: string | null;
  snackPortions: Array<{ portion: object; quantity: number }>;
}>;

type GetSnackWithTotalsFn = (snackId: number) => Promise<SnackWithTotals | null>;

type AddPortionFn = (
  snackId: number,
  portionId: number
) => Promise<{
  id: number;
  snackId: number;
  portionId: number;
  quantity: number;
}>;

type RemovePortionFn = (
  snackId: number,
  portionId: number
) => Promise<{ message: string }>;

type DeleteSnackFn = (snackId: number) => Promise<void>;

// Mocks corretamente tipados
const mockCreateSnack = jest.fn<CreateSnackFn>();
const mockGetSnackWithTotals = jest.fn<GetSnackWithTotalsFn>();
const mockAddPortion = jest.fn<AddPortionFn>();
const mockRemovePortion = jest.fn<RemovePortionFn>();
const mockDeleteSnack = jest.fn<DeleteSnackFn>();

jest.unstable_mockModule(
  '../services/snackService.js',
  () => ({
    SnackService: jest.fn().mockImplementation(() => ({
      createSnack: mockCreateSnack,
      getSnackWithTotals: mockGetSnackWithTotals,
      addPortion: mockAddPortion,
      removePortion: mockRemovePortion,
      getAllSnacks: jest.fn<() => Promise<SnackWithTotals[]>>().mockResolvedValue([]),
      deleteSnack: mockDeleteSnack,
    })),
  })
);

describe('snackController', () => {
  let createSnack: (req: Request, res: Response) => Promise<Response>;
  let getSnack: (req: Request, res: Response) => Promise<Response>;
  let addPortion: (req: Request, res: Response) => Promise<Response>;
  let removePortion: (req: Request, res: Response) => Promise<Response>;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeAll(async () => {
    const module = await import('./snackController.js');
    createSnack = module.createSnack;
    getSnack = module.getSnack;
    addPortion = module.addPortion;
    removePortion = module.removePortion;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = { body: {} };
    res = { status, json } as unknown as Response;
  });

  it('createSnack validates name', async () => {
    req.body = {};
    await createSnack(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('createSnack success', async () => {
    mockCreateSnack.mockResolvedValue({
      id: 1,
      name: 'TestSnack',
      imageUrl: null,
      snackPortions: [],
    });

    req.body = { name: 'TestSnack' };
    await createSnack(req as Request, res as Response);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalled();
    const result = (json.mock.calls[0] as Array<object>)[0];
    expect(result).toHaveProperty('name');
  });

  it('addPortion validates portionId in params', async () => {
    req.params = { snackId: '1' };
    req.body = {};
    await addPortion(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('addPortion validates portionId in body', async () => {
    req.params = { snackId: '1', portionId: '2' };
    req.body = {};
    await addPortion(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
  });

  it('getSnack returns 404 when not found', async () => {
    mockGetSnackWithTotals.mockResolvedValue(null);
    req.params = { id: '999999' };
    await getSnack(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(404);
  });

  it('getSnack returns snack when found', async () => {
    const mockSnack: SnackWithTotals = {
      id: 1,
      name: 'Big Black',
      imageUrl: null,
      portions: [],
      totalCost: '0.0000',
      totalWeightG: 0,
      suggestedPrice: '0.0000',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockGetSnackWithTotals.mockResolvedValue(mockSnack);
    req.params = { id: '1' };
    await getSnack(req as Request, res as Response);
    expect(json).toHaveBeenCalledWith(mockSnack);
  });

  it('removePortion returns 404 when not found', async () => {
    mockRemovePortion.mockRejectedValue(
      new Error('Portion not found in snack.')
    );
    req.params = { snackId: '999999', portionId: '999999' };
    await removePortion(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(404);
  });

  it('removePortion success', async () => {
    mockRemovePortion.mockResolvedValue({ message: 'Portion removed.' });
    req.params = { snackId: '1', portionId: '2' };
    await removePortion(req as Request, res as Response);
    expect(json).toHaveBeenCalledWith({ message: 'Portion removed.' });
  });
});
