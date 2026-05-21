import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',

  globalSetup: require.resolve('./auth/login.setup'), // ⭐ 핵심 수정

  timeout: 120 * 1000,

  expect: {
    timeout: 5000,
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.naver.com',

    locale: 'ko-KR',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'logged-in-tests',
      testDir: './tests/login',

      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth/login.json',
      },
    },

    {
      name: 'guest-tests',
      testDir: './tests/guest',

      use: {
        ...devices['Desktop Chrome'],
        storageState: undefined,
      },
    },
  ],
});