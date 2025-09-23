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
    'plugin:storybook/recommended',
  ],
  overrides: [
    {
      files: ['**/**/*.test.*', '**/**/*.test.tsx.snap'],
      plugins: ['vitest'],
      parserOptions: {
        ecmaVersion: 12,
      },
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
    'vitest/prefer-to-be': 'off',
    'vitest/expect-expect': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroupsExcludedImportTypes: ['builtin'],
        pathGroups: [
          {
            pattern: '@app/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@qa/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@test/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
    /** ! TODO REVISE THIS ENTIRELY */
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 'error',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'comma-dangle': ['error', 'always-multiline'],
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
    es6: true,
  },
}
