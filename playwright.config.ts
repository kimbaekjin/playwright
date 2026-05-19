import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// 1. .env 파일의 환경변수 로드
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  
  /* [실무 표준] 타임아웃 명시적 설정: 무한 대기 방지 */
  timeout: 30 * 1000, // 전체 테스트 최대 30초 대기
  expect: {
    timeout: 5000,    // 단일 expect() 최대 5초 대기
  },

  /* [실무 표준] 테스트 속도 향상을 위한 병렬 처리 (가능한 경우 true 권장) */
  fullyParallel: true,
  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',

  /* 모든 프로젝트 공통 설정 */
  use: {
    /* 하드코딩 제거: .env 파일에서 BASE_URL을 읽어옵니다. */
    baseURL: process.env.BASE_URL || 'https://www.naver.com',
    locale: 'ko-KR',
    
    /* [실무 표준] 디버깅을 위한 아티팩트 설정: 실패했을 때만 남겨서 용량 및 속도 최적화 */
    trace: 'retain-on-failure',      // 실패 시 트레이스 뷰어 기록
    screenshot: 'only-on-failure',   // 실패 시 스크린샷 캡처
    video: 'retain-on-failure',      // 실패 시 화면 녹화 저장
  },

  /* [핵심] 폴더 구조에 맞춘 프로젝트(환경) 분리 및 의존성 설정 */
  projects: [
    // 1. 인증(로그인) 셋업: 가장 먼저 실행되어 login.json 세션을 만듭니다.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/, // auth 폴더 등의 setup.ts 파일을 찾아 실행
    },

    // 2. 로그인 상태가 필요한 테스트 그룹
    {
      name: 'logged-in-tests',
      testDir: './tests/login',   // tests/login 폴더만 실행
      use: { 
        ...devices['Desktop Chrome'],
        // 셋업에서 만든 세션(쿠키/로컬스토리지)을 주입하여 로그인 스킵
        storageState: 'auth/login.json', 
      },
      dependencies: ['setup'],    // 반드시 'setup' 프로젝트가 성공한 뒤에 실행됨
    },

    // 3. 비로그인(게스트) 상태 테스트 그룹
    {
      name: 'guest-tests',
      testDir: './tests/guest',   // tests/guest 폴더만 실행
      use: { 
        ...devices['Desktop Chrome'],
        // 여기는 storageState가 없으므로 깨끗한 시크릿 브라우저로 실행됨
      },
    },
  ],
});