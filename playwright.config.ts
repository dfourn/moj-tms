import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://localhost:3100',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true, // For self-signed certificates
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
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
  // Commenting out webServer config since services are already running
  // webServer: [
  //   {
  //     command: 'cd hmcts-dev-test-backend && ./gradlew bootRun',
  //     url: 'http://localhost:8080/api/tasks',
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 60000,
  //     env: {
  //       JAVA_HOME: '/opt/homebrew/opt/openjdk@21'
  //     }
  //   },
  //   {
  //     command: 'cd hmcts-dev-test-frontend && yarn start:dev',
  //     url: 'https://localhost:3100',
  //     reuseExistingServer: !process.env.CI,
  //     timeout: 60000,
  //     ignoreHTTPSErrors: true
  //   }
  // ],
});