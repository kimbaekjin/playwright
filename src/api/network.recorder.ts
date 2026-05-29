import { Page, Request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class NetworkRecorder {
  private page: Page;
  private clickQueue: { timestamp: number; name: string }[] = [];

  constructor(page: Page) {
    this.page = page;
    this.initClickListener();
  }

  private async initClickListener() {
    await this.page.addInitScript(() => {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const text = target.innerText?.trim() || target.textContent?.trim();
        if (text) {
          (window as any).pushClickEvent(text, Date.now());
          (window as any).isRecordingStarted = true;
        }
      }, true);
    });

    await this.page.exposeFunction('pushClickEvent', (name: string, timestamp: number) => {
      this.clickQueue.push({ timestamp, name });
      if (this.clickQueue.length > 50) this.clickQueue.shift();
    });
  }

  async startRecording() {
    this.page.on('request', async (request: Request) => {
      const url = request.url();
      
      // 1. 추적 대상 필터링
      const isGraphQL = url.includes('/graphql');
      const isNLog = url.includes('/nlog');
      const isClick = url.includes('/crd/rd');
      if (!isGraphQL && !isNLog && !isClick) return;

      // 2. 초기 로딩 시점의 로그(클릭 전) 완벽 차단
      const isStarted = await this.page.evaluate(() => (window as any).isRecordingStarted).catch(() => false);
      if (!isStarted) return;

      const urlObject = new URL(url);
      const queryParams = Object.fromEntries(urlObject.searchParams.entries());
      
      // 3. nop_act 등의 불완전한 액션 필터링
      const aParam = queryParams.a;
      if (!aParam || aParam === 'act') return;

      // 4. 클릭 큐 매칭
      const now = Date.now();
      const match = this.clickQueue.filter(c => now - c.timestamp < 500).pop();
      const buttonName = match ? match.name : null;

      // 5. 버튼이 클릭된 상태의 요청만 매핑에 기록
      if (buttonName) {
        this.updateMappingFile(aParam, buttonName);
      }
    });
  }

  private updateMappingFile(actionKey: string, buttonName: string) {
    const filePath = path.join(process.cwd(), 'data', 'mapping.json');
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    let mapping: any = {};
    if (fs.existsSync(filePath)) {
      try { mapping = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '{}'); } catch {}
    }
    
    // 키가 이미 존재하면 덮어쓰지 않거나 최신값으로 업데이트
    mapping[actionKey] = buttonName;
    fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
    console.log(`[Mapping Updated] ${actionKey} : ${buttonName}`);
  }
}