import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // cria empresa default se não existir
  let company = await prisma.company.findUnique({
    where: { slug: 'default' },
  });
  if (!company) {
    company = await prisma.company.create({
      data: { name: 'Default Company', slug: 'default' },
    });
    console.log(
      'Created default company with id',
      company.id
    );
  } else {
    console.log(
      'Default company already exists with id',
      company.id
    );
  }

  // atualiza registros sem companyId
  const ing = await prisma.ingredient.updateMany({
    where: { companyId: null },
    data: { companyId: company.id },
  });
  console.log('Updated ingredients:', ing.count);
  const por = await prisma.portion.updateMany({
    where: { companyId: null },
    data: { companyId: company.id },
  });
  console.log('Updated portions:', por.count);
  const snk = await prisma.snack.updateMany({
    where: { companyId: null },
    data: { companyId: company.id },
  });
  console.log('Updated snacks:', snk.count);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
