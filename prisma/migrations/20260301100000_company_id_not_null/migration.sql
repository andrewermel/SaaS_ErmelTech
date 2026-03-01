-- 1. Criar empresa default se ainda não existir
INSERT INTO "Company" (name, slug, "createdAt", "updatedAt")
VALUES ('Default Company', 'default-company', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2. Preencher companyId nulo com a empresa default
UPDATE "Ingredient" SET "companyId" = (SELECT id FROM "Company" WHERE slug = 'default-company')
WHERE "companyId" IS NULL;

UPDATE "Portion" SET "companyId" = (SELECT id FROM "Company" WHERE slug = 'default-company')
WHERE "companyId" IS NULL;

UPDATE "Snack" SET "companyId" = (SELECT id FROM "Company" WHERE slug = 'default-company')
WHERE "companyId" IS NULL;

-- 3. Tornar NOT NULL
ALTER TABLE "Ingredient" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Portion" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "Snack" ALTER COLUMN "companyId" SET NOT NULL;

-- 4. Substituir @@unique([name]) por @@unique([companyId, name]) em Ingredient
DROP INDEX "Ingredient_name_key";
CREATE UNIQUE INDEX "Ingredient_companyId_name_key" ON "Ingredient"("companyId", "name");
