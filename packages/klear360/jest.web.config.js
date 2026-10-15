const ignores = ['/node_modules/'];

const baseConfig = {
  testPathIgnorePatterns: [...ignores, 'native.test'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  snapshotSerializers: ['<rootDir>/jestStyledComponentsSerializer.js'],
  moduleFileExtensions: [
    'web.ts',
    'web.tsx',
    'web.js',
    'web.jsx',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  testMatch: ['**/*.test.{ts,tsx,js,jsx}'],
  transform: {
    '\\.(js|jsx|ts|tsx)?$': './jest-preprocess.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@table-library|unist-util-visit-parents|unist-util-is|unist-util-visit)/)',
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './jest-setup.web.js'],
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils$': '<rootDir>/src/utils',
    '^\\~utils/(.*)': '<rootDir>/src/utils/$1',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
    // `@klear/klear360` is "nohoist"-ed (see root package.json), so it keeps its own
    // copies of react/react-dom instead of sharing the ones hoisted to the repo root.
    // Workspace packages like `@klear/i18n-react` resolve `react` to that hoisted
    // root copy, which is a *different* module instance than the one react-dom uses
    // here, so React treats their hooks as called outside of a component render.
    // Force every `react`/`react-dom` require in this project to resolve to the same
    // local copy so there is only one instance in the test run.
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react-dom/(.*)$': '<rootDir>/node_modules/react-dom/$1',
  },
  globals: {
    __DEV__: true,
  },
};

module.exports = {
  testTimeout: 10000,
  projects: [
    {
      displayName: 'SSR Test',
      ...baseConfig,
      testEnvironment: 'node',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'web.test'],
      collectCoverageFrom: ['./src/**/*.ssr.{ts,tsx,js,jsx}'],
      testMatch: ['**/*.ssr.test.{ts,tsx,js,jsx}'],
      setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './jest-setup.ssr.js'],
    },
    {
      displayName: 'CSR Test',
      ...baseConfig,
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'ssr.test'],
      collectCoverageFrom: ['./src/**/*.web.{ts,tsx,js,jsx}'],
    },
  ],
};
