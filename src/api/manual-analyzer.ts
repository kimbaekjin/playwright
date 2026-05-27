import { Page, Route } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

export class ManualInterceptor {
  private readonly mappingPath: string;

  constructor(private page: Page) {
    this.mappingPath = path.join(process.cwd(), 'data', 'mapping.json');
    if (!fs.existsSync(path.dirname(this.mappingPath))) {
      fs.mkdirSync(path.dirname(this.mappingPath), { recursive: true });
    }
  }

  async startRecording(logDir: string = './data/manual-capture') {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    // 1. GraphQL: 필터 값 캡처 (기존 로직 유지)
    await this.page.route('**/graphql', async (route) => {
      const request = route.request();
      const postData = this.tryParse(request.postData() || '');
      if (postData?.[0]?.variables?.input) {
        const input = postData[0].variables.input;
        for (const [key, value] of Object.entries(input)) {
          if (key.startsWith('filter')) console.log(`[필터 적용] ${key}: ${value}`);
        }
      }
      await this.handleCapture(route, 'graphql', logDir);
    });

    // 2. NLOG: 클릭 액션 감지 및 매핑 자동 저장
    await this.page.route('https://nlog.naver.com/n', async (route) => {
      const request = route.request();
      const postData = this.tryParse(request.postData() || '');

      if (postData?.evts?.[0]) {
        const area = postData.evts[0].click_area;
        
        // 브라우저에서 버튼 이름 추출
        const domInfo = await this.page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          return el?.innerText?.trim() || "이름없음";
        });

        // 결과 콘솔 출력
        console.log(`[클릭 감지] 버튼 이름: ${domInfo} (Area: ${area})`);
        
        // 매핑 데이터 자동 저장
        this.updateMappingFile(area, domInfo);
      }
      await this.handleCapture(route, 'nlog', logDir);
    });
  }

  private updateMappingFile(area: string, label: string) {
    let mapping: any = {};
    if (fs.existsSync(this.mappingPath)) {
      mapping = JSON.parse(fs.readFileSync(this.mappingPath, 'utf-8') || '{}');
    }
    
    // 이미 있는 키면 덮어쓰지 않음
    if (!mapping[area]) {
      mapping[area] = label;
      fs.writeFileSync(this.mappingPath, JSON.stringify(mapping, null, 2));
      console.log(`[매핑 저장 완료] ${area} -> ${label}`);
    }
  }

  private async handleCapture(route: Route, type: string, logDir: string) {
    const request = route.request();
    const fileName = path.join(logDir, `${type}_${Date.now()}.json`);
    fs.writeFileSync(fileName, JSON.stringify({
      url: request.url(),
      payload: this.tryParse(request.postData() || ''),
      timestamp: new Date().toISOString()
    }, null, 2));
    await route.continue();
  }

  private tryParse(data: string) {
    try { return JSON.parse(data); } catch { return null; }
  }
}