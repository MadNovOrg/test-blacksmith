module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['**/**/*.test.*', '**/**/*.test.tsx.snap'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      parserOptions: {
        ecmaVersion: 12,
      },
      rules: {
        'jest/no-large-snapshots': ['error'],
        'jest/expect-expect': [
          'error',
          {
            assertFunctionNames: [
              'expect',
              'waitForText',
              'waitForCalls',
              'runTestsForTrainer',
            ],
          },
        ],
      },
    },
    {
      files: ['**/playwright/**'],
      extends: ['plugin:playwright/playwright-test'],
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroupsExcludedImportTypes: ['builtin'],
        pathGroups: [
          { pattern: '@app/**', group: 'external', position: 'after' },
          { pattern: '@test/**', group: 'external', position: 'after' },
        ],
      },
    ],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 'error',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    jest: true,
    es6: true,
    'jest/globals': true,
  },
}
