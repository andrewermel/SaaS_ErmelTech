-- Adiciona campo quantity à tabela SnackPortion
ALTER TABLE "SnackPortion" ADD COLUMN IF NOT EXISTS "quantity" INTEGER NOT NULL DEFAULT 1;

-- Remove o índice único antigo do SnackPortion (pode ter sido removido manualmente)
DROP INDEX IF EXISTS "SnackPortion_snackId_portionId_key";

-- Recria a constraint unique (agora ok pois duplicatas são controladas por quantity)
ALTER TABLE "SnackPortion" ADD CONSTRAINT "SnackPortion_snackId_portionId_key" UNIQUE ("snackId", "portionId");

-- Remove o índice único do nome do Snack (permite snacks com mesmo nome)
DROP INDEX IF EXISTS "Snack_name_key";
