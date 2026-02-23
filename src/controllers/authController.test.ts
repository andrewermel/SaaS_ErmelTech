import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

import { login } from './authController.js';

describe('authController - login', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let testUserId: number;
  const testEmail =
    'testuser_' + Date.now() + '@example.com';
  const testPassword = 'Test@1234';

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(
      testPassword,
      10
    );
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testEmail,
        password: hashedPassword,
      },
    });
    testUserId = user.id;
    process.env.JWT_SECRET = 'test-secret';
  });

  beforeEach(() => {
    mockJson = jest.fn().mockReturnValue(undefined);
    mockStatus = jest
      .fn()
      .mockReturnValue({ json: mockJson });

    mockReq = {
      body: {},
    };

    mockRes = {
      status: mockStatus as any,
      json: mockJson as any,
    };
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
    await prisma.$disconnect();
  });

  it('should return 400 if email is missing', async () => {
    mockReq.body = { password: 'Test@1234' };

    await login(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Email is required.',
    });
  });

  it('should return 400 if password is missing', async () => {
    mockReq.body = { email: 'test@example.com' };

    await login(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Password is required.',
    });
  });

  it('should return 400 if email format is invalid', async () => {
    mockReq.body = {
      email: 'invalid-email',
      password: 'Test@1234',
    };

    await login(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Invalid email format.',
    });
  });

  it('should return 404 when user not found', async () => {
    mockReq.body = {
      email: 'nonexistent_' + Date.now() + '@example.com',
      password: 'Test@1234',
    };

    await login(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'User not found.',
    });
  });

  it('should return 401 when password is invalid', async () => {
    mockReq.body = {
      email: testEmail,
      password: 'WrongPassword@123',
    };

    await login(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Invalid password.',
    });
  });

  it('should return token on successful login', async () => {
    mockReq.body = {
      email: testEmail,
      password: testPassword,
    };

    await login(mockReq as Request, mockRes as Response);

    expect(mockJson).toHaveBeenCalled();
    const response = mockJson.mock.calls[0]?.[0] as any;
    expect(response).toHaveProperty('token');
  });
});
