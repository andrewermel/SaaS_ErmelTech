import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import {
  createTestTenant,
  cleanupTestTenant,
  type TestTenant,
} from './helpers/createTestTenant.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

describe('Role-based authorization (RBAC matrix)', () => {
  let ownerTenant: TestTenant;
  let adminTenant: TestTenant;
  let employeeTenant: TestTenant;
  let companyId: number;

  beforeAll(async () => {
    // Criar empresa com OWNER
    const ownerData = await createTestTenant('rbac-owner');
    ownerTenant = ownerData;
    companyId = ownerData.companyId;

    // Adicionar ADMIN
    const adminUser = await prisma.user.create({
      data: {
        name: 'Test Admin',
        email: `admin_rbac_${Date.now()}@example.com`,
        password: 'hashedpwd',
      },
    });

    await prisma.userCompany.create({
      data: {
        userId: adminUser.id,
        companyId: companyId,
        role: 'ADMIN',
      },
    });

    // Adicionar EMPLOYEE
    const employeeUser = await prisma.user.create({
      data: {
        name: 'Test Employee',
        email: `employee_rbac_${Date.now()}@example.com`,
        password: 'hashedpwd',
      },
    });

    await prisma.userCompany.create({
      data: {
        userId: employeeUser.id,
        companyId: companyId,
        role: 'EMPLOYEE',
      },
    });

    // Gerar tokens JWT
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET!;

    adminTenant = {
      userId: adminUser.id,
      companyId: companyId,
      token: jwt.default.sign(
        {
          userId: adminUser.id,
          email: adminUser.email,
          companyId: companyId,
          role: 'ADMIN',
        },
        secret
      ),
      role: 'ADMIN',
    };

    employeeTenant = {
      userId: employeeUser.id,
      companyId: companyId,
      token: jwt.default.sign(
        {
          userId: employeeUser.id,
          email: employeeUser.email,
          companyId: companyId,
          role: 'EMPLOYEE',
        },
        secret
      ),
      role: 'EMPLOYEE',
    };
  });

  afterAll(async () => {
    await cleanupTestTenant(ownerTenant.userId, ownerTenant.companyId);
    await cleanupTestTenant(adminTenant.userId, companyId);
    await cleanupTestTenant(employeeTenant.userId, companyId);
    await prisma.$disconnect();
  });

  // ========== CREATE AUTHORIZATION TESTS ==========
  it('OWNER passa em autorização para CREATE', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'OWNER',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER', 'ADMIN');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('ADMIN passa em autorização para CREATE', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'ADMIN',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER', 'ADMIN');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('EMPLOYEE recebe 403 para CREATE (acesso negado)', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'EMPLOYEE',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER', 'ADMIN');
    middleware(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  // ========== DELETE AUTHORIZATION TESTS ==========
  it('OWNER passa em autorização para DELETE', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'OWNER',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('ADMIN recebe 403 para DELETE (apenas OWNER)', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'ADMIN',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER');
    middleware(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('EMPLOYEE recebe 403 para DELETE', async () => {
    const next = jest.fn();
    const jsonMock = jest.fn();
    const statusMock = jest
      .fn()
      .mockReturnValue({ json: jsonMock });
    const res = { status: statusMock } as unknown as Response;

    const req = {
      user: {
        role: 'EMPLOYEE',
      },
    } as unknown as Request;

    const middleware = authorizeRole('OWNER');
    middleware(req, res, next);

    expect(statusMock).toHaveBeenCalledWith(403);
  });
});
