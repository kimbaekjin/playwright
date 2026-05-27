import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  fullyParallel: true,
  workers: 6,
  use: {
    // 여기에 추가한 옵션이 모든 테스트에 적용됩니다.
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--allow-running-insecure-content',
        '--disable-blink-features=AutomationControlled', // 봇 탐지 핵심 우회!
      ],
    },
  },
  projects: [
    { name: 'setup', testMatch: 'auth/login.setup.ts', use: { ...devices['Desktop Chrome'], headless: true } },
    { name: 'logged-in-tests', testDir: './tests/login', dependencies: ['setup'], use: { ...devices['Desktop Chrome'], storageState: 'auth/login.json' } },
    { name: 'guest-tests', testDir: './tests/guest', use: { ...devices['Desktop Chrome'] } },
    { name: 'api-tests', testDir: './tests/api', use: { ...devices['Desktop Chrome'] } },
  ],
});