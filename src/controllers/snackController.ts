import { Request, Response } from 'express';
import { handleError } from '../helpers/errorHandler.js';
import {
  sendValidationError,
  validateRequired,
} from '../helpers/validators.js';
import { SnackService } from '../services/snackService.js';

const snackService = new SnackService();

export const createSnack = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, imageUrl } = req.body;
  const file = req.file;

  const nameError = validateRequired(name, 'Name');
  if (nameError) return sendValidationError(nameError, res);

  try {
    // Se houver arquivo, usar o caminho do arquivo, senão usar imageUrl
    const finalImageUrl = file
      ? `/uploads/${file.filename}`
      : imageUrl || null;

    const snack = await snackService.createSnack(
      name,
      finalImageUrl
    );
    return res.status(201).json(snack);
  } catch (error) {
    return handleError(error, 'Error creating snack.', res);
  }
};

export const listSnacks = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  try {
    const snacks = await snackService.getAllSnacks();
    return res.json(snacks);
  } catch (error) {
    return handleError(
      error,
      'Error fetching snacks.',
      res
    );
  }
};

export const getSnack = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id)
    return res.status(400).json({ error: 'Invalid ID.' });

  try {
    const snack = await snackService.getSnackWithTotals(
      parseInt(id)
    );
    if (!snack)
      return res.status(404).json({ error: 'Not found.' });
    return res.json(snack);
  } catch (error) {
    return handleError(error, 'Error fetching snack.', res);
  }
};

export const addPortion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const snackId = req.params.snackId as string;
  const portionId = req.params.portionId as string;

  if (!snackId || !portionId) {
    return res.status(400).json({ error: 'Invalid ID.' });
  }

  const { portionId: bodyPortionId } = req.body;

  const portionError = validateRequired(
    bodyPortionId,
    'PortionId'
  );
  if (portionError)
    return sendValidationError(portionError, res);

  try {
    const snackPortion = await snackService.addPortion(
      parseInt(snackId),
      bodyPortionId
    );
    return res.status(201).json(snackPortion);
  } catch (error) {
    return handleError(error, 'Error adding portion.', res);
  }
};

export const removePortion = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const snackId = req.params.snackId as string;
  const portionId = req.params.portionId as string;

  if (!snackId || !portionId) {
    return res.status(400).json({ error: 'Invalid ID.' });
  }

  try {
    const result = await snackService.removePortion(
      parseInt(snackId),
      parseInt(portionId)
    );
    return res.json(result);
  } catch (error) {
    return handleError(
      error,
      'Error removing portion.',
      res
    );
  }
};

export const deleteSnack = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id)
    return res.status(400).json({ error: 'Invalid ID.' });

  try {
    await snackService.deleteSnack(parseInt(id));
    return res.json({ message: 'Deleted.' });
  } catch (error) {
    return handleError(error, 'Error deleting snack.', res);
  }
};
