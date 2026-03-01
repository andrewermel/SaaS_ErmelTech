import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateSlug } from '../helpers/slug.js';

/**
 * 👤 UserService
 *
 * Classe responsável pela lógica de negócio de usuários
 * Trata da criação, validação e segurança de senhas
 */
export class UserService {
  /**
   * Cria um novo usuário no banco de dados.
   * Se companyName for fornecido, cria empresa em transação e vincula como OWNER.
   *
   * @param name - Nome do usuário
   * @param email - Email único do usuário
   * @param password - Senha (será criptografada)
   * @param companyName - Nome da empresa (opcional — se fornecido, cria empresa)
   * @returns Usuário criado sem a senha (+ empresa se criada)
   * @throws Erro se usuário já existe
   */
  async create(
    name: string,
    email: string,
    password: string,
    companyName?: string
  ) {
    // Padronizar email
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error('User already exists.');
    }

    // Criptografar senha com bcrypt (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // SE companyName fornecido → transação criando user + company
    if (companyName) {
      return prisma.$transaction(async tx => {
        const user = await tx.user.create({
          data: {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
          },
        });

        const slug = generateSlug(companyName);
        const company = await tx.company.create({
          data: {
            name: companyName.trim(),
            slug,
          },
        });

        await tx.userCompany.create({
          data: {
            userId: user.id,
            companyId: company.id,
            role: 'OWNER',
          },
        });

        const { password: _, ...userWithoutPassword } =
          user;
        return { ...userWithoutPassword, company };
      });
    }

    // SEM companyName → comportamento original (testes antigos passam aqui)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Retornar sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
