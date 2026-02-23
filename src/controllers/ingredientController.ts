import { Request, Response } from "express";
import { handlePrismaError } from "../helpers/errorHandler.js";
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
  const { name, weightG, cost } = req.body;

  const nameError = validateRequired(name, "Name");
  if (nameError) return sendValidationError(nameError, res);

  const weightError = validatePositive(weightG, "Weight");
  if (weightError) return sendValidationError(weightError, res);

  const costError = validateNonNegative(cost, "Cost");
  if (costError) return sendValidationError(costError, res);

  try {
    const ingredient = await ingredientService.create(name, weightG, cost);
    return res.status(201).json(ingredient);
  } catch (error) {
    return handlePrismaError(error, res);
  }
};

export const listIngredients = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const ingredients = await ingredientService.findAll();
    return res.json(ingredients);
  } catch (error) {
    return handlePrismaError(error, res);
  }
};

export const getIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    const ingredient = await ingredientService.findById(parseInt(id));
    if (!ingredient) return res.status(404).json({ error: "Not found." });
    return res.json(ingredient);
  } catch (error) {
    return handlePrismaError(error, res);
  }
};

export const updateIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
    });
    return res.json(ingredient);
  } catch (error) {
    return handlePrismaError(error, res);
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id = req.params.id as string;

  if (!id) return res.status(400).json({ error: "Invalid ID." });

  try {
    await ingredientService.delete(parseInt(id));
    return res.json({ message: "Deleted." });
  } catch (error) {
    return handlePrismaError(error, res);
  }
};
