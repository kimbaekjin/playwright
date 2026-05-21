import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  // globalSetup 제거
  
  projects: [
    // 1. 로그인 테스트 프로젝트 (다른 테스트의 의존성)
    {
      name: 'setup',
      testMatch: 'auth/login.setup.ts',
      use: { 
        ...devices['Desktop Chrome'],
        // setup은 headless 모드로 빠르게 수행하는 게 좋습니다.
        headless: true 
      },
    },

    // 2. 로그인 필요한 실제 테스트들
    {
      name: 'logged-in-tests',
      testDir: './tests/login',
      dependencies: ['setup'], // 💡 setup 프로젝트가 먼저 끝나야 실행됨
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth/login.json', // 여기서 저장된 쿠키 사용
      },
    },

    // 3. 비로그인 테스트
    {
      name: 'guest-tests',
      testDir: './tests/guest',
      use: { ...devices['Desktop Chrome'] },
    },

    // 4. api 테스트 
    {
      name: 'api-tests',
      testDir: './tests/api/', // 이 폴더를 바라보게 설정
      use: { ...devices['Desktop Chrome'] },
    },

  ],
});