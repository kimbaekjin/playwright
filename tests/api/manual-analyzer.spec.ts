// import { test } from '@playwright/test';
// import fs from 'fs';
// import path from 'path';

// test('네이버 지도 API 분석 도구', async ({ page }) => {
//   const logDir = path.join(__dirname, 'logs');
//   if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

//   // 봇 탐지 우회 스크립트 추가
//   await page.addInitScript(() => {
//     Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
//     // 가끔 navigator.webdriver가 true로 돌아오는 경우를 방지
//     delete (navigator as any).webdriver;
//   });

//   let currentAction = '대기중';
//   let capturedLogs: any[] = [];
//   let timer: NodeJS.Timeout | null = null;

//   // 클릭 이벤트 로깅
//   await page.exposeFunction('logAction', (action: string) => {
//     currentAction = action;
//     capturedLogs = [];
//     console.log(`\n🖱️ 조작 감지: [${action}]`);
//   });

//   await page.addInitScript(() => {
//     document.addEventListener('click', (e) => {
//       const target = e.target as HTMLElement;
//       const actionName = target.innerText?.trim() || target.className || 'Unknown';
//       (window as any).logAction(actionName);
//     });
//   });

//   // API 호출 감지
//   page.on('response', async (response) => {
//     const url = response.url();
//     if (url.includes('api') || url.includes('graphql')) {
//       capturedLogs.push({ url, status: response.status() });
      
//       if (timer) clearTimeout(timer);
//       timer = setTimeout(() => {
//         if (capturedLogs.length > 0) {
//           // 💡 파일명에 개수를 포함하도록 수정
//           // 예: log_[포장주문]_5개_1779350885.json
//           const cleanAction = currentAction.replace(/[^a-z0-9ㄱ-ㅎ가-힣]/gi, '_');
//           const fileName = `log_[${cleanAction}]_${capturedLogs.length}개_${Date.now()}.json`;
          
//           fs.writeFileSync(path.join(logDir, fileName), JSON.stringify(capturedLogs, null, 2));
//           console.log(`✅ [${currentAction}] 관련 API ${capturedLogs.length}개 저장 완료!`);
//         }
//       }, 3000);
//     }
//   });

//   await page.goto('https://stg.map.naver.com/p/search/음식점?searchType=place');
  
//   console.log('🛑 분석 모드 시작: 브라우저에서 자유롭게 조작하세요.');
//   await page.pause();
// });