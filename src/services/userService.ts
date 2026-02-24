import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

/**
 * 👤 UserService
 *
 * Classe responsável pela lógica de negócio de usuários
 * Trata da criação, validação e segurança de senhas
 */
export class UserService {
  /**
   * Cria um novo usuário no banco de dados
   *
   * @param name - Nome do usuário
   * @param email - Email único do usuário
   * @param password - Senha (será criptografada)
   * @param companyName - Nome da empresa para onboarding
   * @returns Usuário criado sem a senha + Empresa criada
   * @throws Erro se usuário já existe
   */
  async create(
    name: string,
    email: string,
    password: string,
    companyName: string
  ): Promise<{
    user: {
      id: number;
      name: string;
      email: string;
      createdAt: Date;
    };
    company: {
      id: number;
      name: string;
      slug: string;
      email: string | null;
      phone: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }> {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingUser)
      throw new Error('User already exists.');

    const hashedPassword = await bcrypt.hash(password, 12);

    // Helper local para gerar slug (mesma lógica usada no CompanyService)
    const generateSlug = (value: string) =>
      value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Transação: criar user, company e userCompany (OWNER)
    const result = await prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

      const company = await tx.company.create({
        data: {
          name: companyName.trim(),
          slug: generateSlug(companyName),
        },
      });

      await tx.userCompany.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: 'OWNER',
        },
      });

      // Omitir password do user
      const { password: _ } = user;
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return { user: userWithoutPassword, company };
    });

    return result;
  }

  /**
   * Valida se email e senha correspondem a um usuário
   *
   * @param email - Email do usuário
   * @param password - Senha a validar
   * @returns Usuário se válido, null caso contrário
   */
  async validateCredentials(
    email: string,
    password: string
  ): Promise<{
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  } | null> {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) return null;

    return user;
  }
}
