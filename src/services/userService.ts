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
   * @returns Usuário criado sem a senha
   * @throws Erro se usuário já existe
   */
  async create(
    name: string,
    email: string,
    password: string
  ): Promise<{
    id: number;
    name: string;
    email: string;
    createdAt: Date;
  }> {
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

    // Criar usuário
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
