import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// quiet: true suppresses dotenv's random self-promo "tip" console lines.
dotenv.config({ path: path.resolve(__dirname, '.env.e2e'), quiet: true });

const BASE_URL = process.env.E2E_BASE_URL || 'https://test.mywehr.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 30_000,
  globalSetup: './global-setup.ts',

  use: {
    baseURL: BASE_URL,
    video: 'on',
    trace: 'on',
    screenshot: 'on',
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
