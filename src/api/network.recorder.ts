// src/api/network.recorder.ts
import { Page, Request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class NetworkRecorder {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.initClickListener();
  }

  private async initClickListener() {
    // 페이지가 이동해도 다시 실행되도록 리스너를 유지합니다.
    await this.page.addInitScript(() => {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const text = target.innerText?.trim() || target.textContent?.trim();
        if (text) {
          (window as any).lastClickedButton = text;
          (window as any).isRecordingAllowed = true;
        }
      }, true);
    });
  }

  async startRecording() {
    this.page.on('request', async (request: Request) => {
      // 1. 페이지가 닫혔거나 이동 중이면 무시
      if (this.page.isClosed()) return;

      const url = request.url();
      if (!url.includes('/graphql') && !url.includes('/nlog') && !url.includes('/crd/rd')) return;

      try {
        // 2. 실행 컨텍스트 에러 방지 (try-catch)
        const status = await this.page.evaluate(() => ({
          allowed: (window as any).isRecordingAllowed || false,
          buttonName: (window as any).lastClickedButton || "unknown"
        })).catch(() => ({ allowed: false, buttonName: "unknown" }));

        if (!status.allowed) return;

        const urlObject = new URL(url);
        const queryParams = Object.fromEntries(urlObject.searchParams.entries());
        const p = queryParams.p || 'no-p';
        const a = queryParams.a || 'no-a';
        const uniqueId = `${p}_${a}`.replace(/[*"/:<>?|]/g, '_');
        
        let refinedName = status.buttonName;
        if (a && a.includes('nmb_res')) {
          const match = a.match(/nmb_res[._]?(.+)/);
          if (match && match[1]) refinedName = match[1].replace(/[._*]/g, '');
        }

        this.updateMappingFile(uniqueId, refinedName);

        const type = url.includes('/graphql') ? 'graphql' : 'nlog';
        const logData = { buttonName: refinedName, uniqueId, url, method: request.method(), queryParams, timestamp: new Date().toISOString() };
        this.saveToFile(type, logData, uniqueId);
      } catch (err) {
        // 네비게이션 중 컨텍스트 파괴 에러는 자연스러운 현상이므로 무시
      }
    });
  }

  private updateMappingFile(uniqueId: string, buttonName: string) {
    const filePath = path.join(__dirname, '../../data/mapping.json');
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    let mapping: any = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8') || '{}') : {};
    mapping[uniqueId] = buttonName;
    fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
  }

  private saveToFile(type: string, data: any, uniqueId: string) {
    const dir = path.join(__dirname, '../../data', type);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${uniqueId.substring(0, 50)}_${Date.now()}.json`), JSON.stringify(data, null, 2));
  }
}