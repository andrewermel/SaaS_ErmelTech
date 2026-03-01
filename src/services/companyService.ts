import prisma from '../lib/prisma.js';
import { generateSlug } from '../helpers/slug.js';

/**
 * 🏢 CompanyService
 *
 * Lógica de negócio para empresas (tenants).
 * Criação de empresa com geração de slug, busca e gerenciamento de membros.
 */
export class CompanyService {
  /**
   * Cria uma nova empresa e vincula o criador como OWNER.
   */
  async create(
    name: string,
    ownerId: number,
    email?: string
  ) {
    const slug = generateSlug(name);

    return prisma.$transaction(async tx => {
      const company = await tx.company.create({
        data: {
          name: name.trim(),
          slug,
          email: email || null,
        },
      });

      await tx.userCompany.create({
        data: {
          userId: ownerId,
          companyId: company.id,
          role: 'OWNER',
        },
      });

      return company;
    });
  }

  /**
   * Busca uma empresa por ID.
   */
  async findById(id: number) {
    return prisma.company.findUnique({
      where: { id },
    });
  }

  /**
   * Busca todos os membros de uma empresa.
   */
  async findMembers(companyId: number) {
    return prisma.userCompany.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Atualiza dados da empresa.
   */
  async update(
    id: number,
    data: { name?: string; email?: string; phone?: string }
  ) {
    const updateData: {
      name?: string;
      slug?: string;
      email?: string;
      phone?: string;
    } = {};

    if (data.name) {
      updateData.name = data.name.trim();
      updateData.slug = generateSlug(data.name);
    }
    if (data.email !== undefined)
      updateData.email = data.email;
    if (data.phone !== undefined)
      updateData.phone = data.phone;

    return prisma.company.update({
      where: { id },
      data: updateData,
    });
  }
}
