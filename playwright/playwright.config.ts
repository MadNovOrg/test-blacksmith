import { PlaywrightTestConfig, devices } from '@playwright/test'

const PROJECTS_BY_DEVICE = [
  {
    name: 'chromium',
    testIgnore: /.*\.query.test.ts/,
    use: devices['Desktop Chrome'],
  },

  {
    name: 'firefox',
    testIgnore: /.*\.query.test.ts/,
    use: devices['Desktop Firefox'],
  },

  {
    name: 'webkit',
    testIgnore: /.*\.query.test.ts/,
    use: devices['Desktop Safari'],
  },

  /* Test against at least one mobile viewport. */
  {
    name: 'mobile',
    testIgnore: /.*\.query.test.ts/,
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

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./hooks/global-setup'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    timezoneId: 'UTC',
  },
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
  expect: {
    timeout: 30 * 1000,
  },
  timeout: 60 * 1000,
  projects: [...PROJECTS_BY_DEVICE, ...PROJECTS_BY_TEST_TYPE],
}

export default config
