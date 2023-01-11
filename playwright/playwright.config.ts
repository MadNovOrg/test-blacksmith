import { PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  globalSetup: require.resolve('./hooks/global-setup'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on',
    timezoneId: 'UTC',
  },
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}
export default config
