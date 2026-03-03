import prisma from '../lib/prisma.js';
import { generateSlug } from '../helpers/slug.js';
import bcrypt from 'bcryptjs';

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

  /**
   * Convida um usuário para a empresa com uma role específica.
   * O usuário DEVE estar registrado no sistema.
   *
   * @param companyId - ID da empresa
   * @param email - Email do usuário a convidar
   * @param role - Role ('ADMIN' ou 'EMPLOYEE')
   * @returns UserCompany criado
   * @throws Erro se usuário não existe, já é membro ou companyId inválido
   */
  async inviteMember(
    companyId: number,
    email: string,
    role: 'ADMIN' | 'EMPLOYEE'
  ) {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error(
        `Company with ID ${companyId} not found.`
      );
    }

    // 2. Buscar o usuário por email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error(
        `User with email ${normalizedEmail} not found. User must be registered first.`
      );
    }

    // 3. Verificar se já é membro da empresa
    const existingMember =
      await prisma.userCompany.findUnique({
        where: {
          userId_companyId: {
            userId: user.id,
            companyId,
          },
        },
      });

    if (existingMember) {
      throw new Error(
        `User ${normalizedEmail} is already a member of this company.`
      );
    }

    // 4. Criar vínculo com a role especificada
    return prisma.userCompany.create({
      data: {
        userId: user.id,
        companyId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Cria um novo usuário E o vincula à empresa como ADMIN.
   * Transação: User + UserCompany são criados juntos.
   *
   * @param companyId - ID da empresa
   * @param name - Nome do novo usuário
   * @param email - Email único do novo usuário
   * @param password - Senha (será criptografada)
   * @returns UserCompany criado com dados do usuário
   * @throws Erro se email já existe, company não existe
   */
  async createMember(
    companyId: number,
    name: string,
    email: string,
    password: string
  ) {
    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Verificar se a empresa existe
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error(
        `Company with ID ${companyId} not found.`
      );
    }

    // 2. Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error(
        `User with email ${normalizedEmail} already exists.`
      );
    }

    // 3. Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Criar User + UserCompany em transação
    return prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

      const userCompany = await tx.userCompany.create({
        data: {
          userId: user.id,
          companyId,
          role: 'ADMIN',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return userCompany;
    });
  }
}
