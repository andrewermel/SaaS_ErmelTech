-- Remove a constraint unique que impede múltiplas porções iguais
ALTER TABLE "SnackPortion" DROP CONSTRAINT IF EXISTS "SnackPortion_snackId_portionId_key";
