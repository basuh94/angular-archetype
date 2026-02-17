module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec).ts'],

  // Cobertura base para mantener calidad mínima del arquetipo.
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/app/**/*.config*.ts',
    '!src/app/**/*.routes*.ts',
    '!src/app/**/*.page.ts',
    '!src/app/layout/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
};
