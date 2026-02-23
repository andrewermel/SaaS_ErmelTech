import { Request, Response } from "express";
import { handleError } from "../helpers/errorHandler.js";
import {
    sendValidationError,
    validatePositive,
    validateRequired,
} from "../helpers/validators.js";
import { PortionService } from "../services/portionService.js";

const portionService = new PortionService();

export const createPortion = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { ingredientId, name, weightG } = req.body;

  const ingredientError = validateRequired(ingredientId, "IngredientId");
  if (ingredientError) return sendValidationError(ingredientError, res);

  const nameError = validateRequired(name, "Name");
  if (nameError) return sendValidationError(nameError, res);

  const weightError = validatePositive(weightG, "Weight");
  if (weightError) return sendValidationError(weightError, res);

  try {
    const portion = await portionService.create(ingredientId, name, weightG);
    return res.status(201).json(portion);
  } catch (error) {
    return handleError(error, "Error creating portion.", res);
  }
};

export const listPortions = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const portions = await portionService.findAll();
    return res.json(portions);
  } catch (error) {
    return handleError(error, "Error fetching portions.", res);
  }
};

export const getPortion = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    const portion = await portionService.findById(parseInt(id));
    if (!portion) return res.status(404).json({ error: "Not found." });
    return res.json(portion);
  } catch (error) {
    return handleError(error, "Error fetching portion.", res);
  }
};

export const updatePortion = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  const { name, weightG } = req.body;

  if (weightG !== undefined) {
    const weightError = validatePositive(weightG, "Weight");
    if (weightError) return sendValidationError(weightError, res);
  }

  try {
    const portion = await portionService.update(parseInt(id), {
      name,
      weightG,
    });
    return res.json(portion);
  } catch (error) {
    return handleError(error, "Error updating portion.", res);
  }
};

export const deletePortion = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    const result = await portionService.delete(parseInt(id));
    return res.json(result);
  } catch (error) {
    return handleError(error, "Error deleting portion.", res);
  }
};
