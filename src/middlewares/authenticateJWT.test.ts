import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from './authenticateJWT.js';

describe('authenticateJWT middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let verifyMock: jest.SpiedFunction<typeof jwt.verify>;

  beforeEach(() => {
    jest.clearAllMocks();

    verifyMock = jest.spyOn(
      jwt,
      'verify'
    ) as jest.SpiedFunction<typeof jwt.verify>;

    mockJson = jest.fn().mockReturnValue(undefined);
    mockStatus = jest
      .fn()
      .mockReturnValue({ json: mockJson });
    mockNext = jest.fn();

    mockReq = {
      headers: {},
    };

    mockRes = {
      status: mockStatus as any,
      json: mockJson as any,
    };

    process.env.JWT_SECRET = 'test-secret';
  });

  it('should return 401 if no authorization header is provided', () => {
    authenticateJWT(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Token not provided.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    mockReq.headers = { authorization: 'Basic token123' };

    authenticateJWT(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({
      error:
        "Invalid authorization header format. Expected 'Bearer <token>'.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 if JWT_SECRET is not configured', () => {
    delete process.env.JWT_SECRET;
    mockReq.headers = { authorization: 'Bearer token123' };

    authenticateJWT(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'JWT secret not configured.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    mockReq.headers = {
      authorization: 'Bearer invalid-token',
    };
    verifyMock.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateJWT(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockStatus).toHaveBeenCalledWith(403);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Invalid or expired token.',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() and set req.user on valid token', () => {
    const decodedToken = {
      userId: 1,
      email: 'test@example.com',
    };
    mockReq.headers = {
      authorization: 'Bearer valid-token',
    };
    verifyMock.mockReturnValue(decodedToken as any);

    authenticateJWT(
      mockReq as Request,
      mockRes as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual(decodedToken);
  });
});
