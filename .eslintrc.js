const path = require('path')

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
        'jest/no-large-snapshots': [
          'error',
          {
            allowedSnapshots: {
              [path.resolve(
                'src/components/OrgInvitesTable/__snapshots__/OrgInvitesTable.test.tsx.snap'
              )]: ['OrgInvitesTable matches snapshot 1'],
              [path.resolve(
                'src/components/OrgUsersTable/__snapshots__/OrgUsersTable.test.tsx.snap'
              )]: ['OrgUsersTable matches snapshot 1'],
              [path.resolve(
                'src/pages/admin/components/Organizations/__snapshots__/EditOrgDetails.test.tsx.snap'
              )]: ['EditOrgDetails matches snapshot 1'],
              [path.resolve(
                'src/pages/admin/components/Organizations/tabs/__snapshots__/OrgDetailsTab.test.tsx.snap'
              )]: ['OrgDetailsTab matches snapshot 1'],
              [path.resolve(
                'src/pages/common/CourseBooking/components/CourseBookingDetails/__snapshots__/CourseBookingDetails.test.tsx.snap'
              )]: [
                'CourseBookingDetails matches snapshot for CLOSED course 1',
                'CourseBookingDetails matches snapshot for OPEN course 1',
              ],
              [path.resolve(
                'src/pages/common/CourseBooking/components/CourseBookingDone/__snapshots__/CourseBookingDone.test.tsx.snap'
              )]: ['CourseBookingDone matches snapshot 1'],
              [path.resolve(
                'src/pages/common/CourseBooking/components/CourseBookingReview/__snapshots__/CourseBookingReview.test.tsx.snap'
              )]: [
                'CourseBookingReview matches snapshot for CLOSED course 1',
                'CourseBookingReview matches snapshot for OPEN course 1',
              ],
              [path.resolve(
                'src/pages/common/Login/__snapshots__/Login.test.tsx.snap'
              )]: ['Login matches snapshot 1'],
              [path.resolve(
                'src/pages/common/Registration/components/__snapshots__/Form.test.tsx.snap'
              )]: ['Form matches snapshot 1'],
              [path.resolve(
                'src/pages/common/VerifyEmail/__snapshots__/VerifyEmail.test.tsx.snap'
              )]: ['page: VerifyEmailPage matchs snapshot 1'],
            },
          },
        ],
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
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      }
    ],
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
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
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
