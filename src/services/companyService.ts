import { Role } from '@prisma/client';
import prisma from '../lib/prisma.js';

export class CompanyService {
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  async create(
    name: string,
    email?: string,
    phone?: string
  ) {
    const slug = this.generateSlug(name);
    return prisma.company.create({
      data: {
        name: name.trim(),
        slug,
        email: email ?? null,
        phone: phone ?? null,
      },
    });
  }

  async findById(id: number) {
    return prisma.company.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return prisma.company.findUnique({ where: { slug } });
  }

  async addUser(
    companyId: number,
    userId: number,
    role: Role = 'EMPLOYEE'
  ) {
    return prisma.userCompany.create({
      data: {
        companyId,
        userId,
        role,
      },
    });
  }

  async getMembers(companyId: number) {
    return prisma.userCompany.findMany({
      where: { companyId },
      include: { user: true },
    });
  }

  async update(
    id: number,
    data: { name?: string; email?: string; phone?: string }
  ) {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = this.generateSlug(data.name);
      updateData.name = data.name.trim();
    }
    return prisma.company.update({
      where: { id },
      data: updateData,
    });
  }
}

// Export only the class; controllers instantiate the service when needed
