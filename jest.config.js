const { transformTsPaths } = require('ts-paths-transform');

const {
  // @ts-ignore
  compilerOptions: { paths: tsconfigPaths },
} = require('./tsconfig.json');

/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  moduleNameMapper: transformTsPaths(tsconfigPaths, {
    prefix: '<RootDir>/../../',
    // @ts-ignore
    debug: true,
  }),
  logHeapUsage: true,
  roots: ['<rootDir>/'],
  testMatch: ['**/?(*.)+(spec|test|e2e).+(ts)'],
  transform: {
    '^.+\\.(ts)$': '@swc/jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '\\.d.ts',
    'main.ts',
    '.entity.ts',
    'index.ts',
    '.module.ts',
    '.type.ts',
  ],
  setupFiles: ['dotenv-flow/config'],
  testEnvironment: 'node',
};
