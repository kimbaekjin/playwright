import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('모든 액션과 호출된 API 매핑하여 로그 저장', async ({ page }) => {
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

  // 현재 어떤 버튼을 눌렀는지 추적할 변수
  let lastAction = 'Initial Load';

  // 1. 클릭 이벤트 감지
  await page.exposeFunction('logClick', (elementInfo: string) => {
    lastAction = elementInfo;
    console.log(`🖱️ 클릭 감지: ${elementInfo}`);
  });

  await page.addInitScript(() => {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      (window as any).logClick(target.tagName + ' - ' + (target.innerText || target.className));
    });
  });

// 2. 응답 감지 시 수정
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('api') || url.includes('graphql')) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: lastAction,
        url: url,
        status: response.status(),
      };
      
      // 💡 개별 파일 대신, 하나의 파일에 로그를 줄바꿈해서 이어 붙입니다.
      const logFilePath = path.join(logDir, 'full_api_log.jsonl'); // JSONL 형식 (한 줄씩 JSON)
      
      // JSON 데이터를 문자열로 변환하고 줄바꿈 추가
      const logLine = JSON.stringify(logEntry) + '\n';
      
      // appendFileSync를 사용하여 파일이 있으면 뒤에 내용을 추가합니다.
      fs.appendFileSync(logFilePath, logLine);
      
      console.log(`💾 로그 추가됨: [${lastAction}] -> ${url}`);
    }
  });

  await page.goto('https://nxgen.search.naver.com/p/sqa/search.naver?query=음식점&debug=1');
  
  console.log('🛑 실시간 API 로깅 시작. 화면을 마음껏 조작하세요.');
  await page.pause(); 
});