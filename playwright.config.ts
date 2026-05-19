import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',

  /* 전체 타임아웃 */
  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: 'html',

  /* 공통 브라우저/환경 설정 */
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.naver.com',

    locale: 'ko-KR',

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* 프로젝트 분리 (실무 핵심 구조) */
  projects: [
    /* 로그인 상태 테스트 */
    {
      name: 'logged-in-tests',
      testDir: './tests/login',

      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth/login.json',
      },
    },

    /* 비로그인 상태 테스트 */
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