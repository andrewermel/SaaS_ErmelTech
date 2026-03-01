import { Request, Response } from "express";
import { handleError } from "../helpers/errorHandler.js";
import {
  sendValidationError,
  validateNonNegative,
  validatePositive,
  validateRequired,
} from "../helpers/validators.js";
import { IngredientService } from "../services/ingredientService.js";

const ingredientService = new IngredientService();

export const createIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const companyId = req.user!.companyId!;
  const { name, weightG, cost } = req.body;

  const nameError = validateRequired(name, "Name");
  if (nameError) return sendValidationError(nameError, res);

  const weightError = validatePositive(weightG, "Weight");
  if (weightError) return sendValidationError(weightError, res);

  const costError = validateNonNegative(cost, "Cost");
  if (costError) return sendValidationError(costError, res);

  try {
    const ingredient = await ingredientService.create(name, weightG, cost, companyId);
    return res.status(201).json(ingredient);
  } catch (error) {
    return handleError(error, "Error creating ingredient.", res);
  }
};

export const listIngredients = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const companyId = req.user!.companyId!;

  try {
    const ingredients = await ingredientService.findAll(companyId);
    return res.json(ingredients);
  } catch (error) {
    return handleError(error, "Error fetching ingredients.", res);
  }
};

export const getIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const companyId = req.user!.companyId!;
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    const ingredient = await ingredientService.findById(parseInt(id), companyId);
    if (!ingredient) return res.status(404).json({ error: "Not found." });
    return res.json(ingredient);
  } catch (error) {
    return handleError(error, "Error fetching ingredient.", res);
  }
};

export const updateIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const companyId = req.user!.companyId!;
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  const { name, weightG, cost } = req.body;

  if (weightG !== undefined) {
    const weightError = validatePositive(weightG, "Weight");
    if (weightError) return sendValidationError(weightError, res);
  }

  if (cost !== undefined) {
    const costError = validateNonNegative(cost, "Cost");
    if (costError) return sendValidationError(costError, res);
  }

  try {
    const ingredient = await ingredientService.update(parseInt(id), {
      name,
      weightG,
      cost,
    }, companyId);
    return res.json(ingredient);
  } catch (error) {
    return handleError(error, "Error updating ingredient.", res);
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const companyId = req.user!.companyId!;
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    await ingredientService.delete(parseInt(id), companyId);
    return res.json({ message: "Deleted." });
  } catch (error) {
    return handleError(error, "Error deleting ingredient.", res);
  }
};
