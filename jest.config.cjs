// Carrega .env.test antes de spawnar os workers do Jest.
// Variáveis definidas aqui são herdadas por todos os processos filho.
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Garante fallbacks para testes que dependem de JWT
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-for-ci';
}

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
