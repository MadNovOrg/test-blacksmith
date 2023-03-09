process.env.TZ = 'Europe/London'

/** @type {import('jest').Config} */
const config = {
  testTimeout: 10000,
  testEnvironment: 'jsdom',
  coverageReporters: ['lcov', 'text', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ],
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  setupFiles: ['<rootDir>/node_modules/jest-offline'],
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.svg': '<rootDir>/test/__mocks__/svg.js',
    '\\.png': '<rootDir>/test/__mocks__/png.js',
    '\\.jpg': '<rootDir>/test/__mocks__/jpg.js',
    '^@app/(.*)': '<rootDir>/src/$1',
    '^@test/(.*)': '<rootDir>/test/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/playwright'],
  transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
}

module.exports = config
