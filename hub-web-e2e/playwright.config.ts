import { workspaceRoot } from '@nx/devkit'
import { nxE2EPreset } from '@nx/playwright/preset'
import { defineConfig, devices } from '@playwright/test'

import { isUK } from './src/constants'
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL =
  process.env['BASE_URL'] ||
  `http://localhost:${
    process.env['AWS_REGION'] === 'ap-southeast-2' ? '4000' : '3000'
  }`

const PROJECTS_BY_DEVICE = [
  {
    name: 'chromium',
    testIgnore: /.*\.query.test.ts/,
    dependencies: ['setup'],
    use: devices['Desktop Chrome'],
  },

  {
    name: 'firefox',
    testIgnore: /.*\.query.test.ts/,
    dependencies: ['setup'],
    use: devices['Desktop Firefox'],
  },

  {
    name: 'webkit',
    testIgnore: /.*\.query.test.ts/,
    dependencies: ['setup'],
    use: devices['Desktop Safari'],
  },

  /* Test against at least one mobile viewport. */
  {
    name: 'mobile',
    testIgnore: /.*\.query.test.ts/,
    dependencies: ['setup'],
    use: devices['Pixel 5'],
  },
]

const PROJECTS_BY_TEST_TYPE = [
  {
    name: 'queries',
    testMatch: /.*\.query.test.ts/,
    retries: 0,
  },
]

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './tests' }),
  /**
   * Shared settings for all the projects below.
   * @see https://playwright.dev/docs/api/class-testoptions
   */
  use: {
    baseURL,
    /**
     * Collect trace when retrying the failed test.
     * Always record video of the feature being tested.
     * @see https://playwright.dev/docs/trace-viewer
     */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timezoneId: 'UTC',
    headless: true,
  },
  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: isUK() ? 'pnpm dev' : 'pnpm dev:au', // TODO change to `pnpm nx dev hub-web`
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      cwd: workspaceRoot,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 120 * 1000,
    },
  ],
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 60 * 1000,
  },
  timeout: 60 * 1000,
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      fullyParallel: true,
    },
    ...PROJECTS_BY_DEVICE,
    ...PROJECTS_BY_TEST_TYPE,
  ],
})
