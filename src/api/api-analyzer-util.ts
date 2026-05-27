import fs from 'fs';
import path from 'path';

export class ApiAnalyzer {
  static async setup(page: any, logDir: string) {
    // 봇 탐지 우회
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // 클릭 감지 및 로깅 (HTML + API 저장 통합)
    await page.exposeFunction('saveAllLogs', (elementInfo: any, apiLogs: any[]) => {
      const timestamp = Date.now();
      const folderName = `log_${timestamp}_${elementInfo.tagName.toLowerCase()}_${elementInfo.text.replace(/[^a-z0-9]/gi, '_')}`;
      const dir = path.join(logDir, folderName);
      
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // 1. HTML 정보 저장
      fs.writeFileSync(path.join(dir, '1_html.json'), JSON.stringify(elementInfo, null, 2));
      // 2. API 데이터 저장
      fs.writeFileSync(path.join(dir, '2_api.json'), JSON.stringify(apiLogs, null, 2));
      
      console.log(`✅ 저장 완료: ${dir}`);
    });

    // 브라우저에서 클릭 감지 시 API 수집 로직
    await page.addInitScript(() => {
      let currentLogs: any[] = [];
      
      // 통신 가로채기 (브라우저 콘솔 레벨에서 감지)
      (window as any).performance.getEntriesByType("resource").forEach((res: any) => {
          if (res.name.includes('graphql')) currentLogs.push(res.name);
      });

      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const info = {
            tagName: target.tagName,
            text: target.innerText?.trim() || 'no_text',
            className: target.className,
            timestamp: Date.now()
        };
        // 클릭 후 1초 동안 발생하는 네트워크 요청을 모아서 저장 호출
        setTimeout(() => {
            (window as any).saveAllLogs(info, currentLogs);
        }, 1000);
      });
    });
  }
}