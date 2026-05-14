import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

declare const __dirname: string;

export class ServerTranslateLoader implements TranslateLoader {
  private resolvedBasePath?: string | null;

  private resolveBasePath(): string | null {
    if (this.resolvedBasePath !== undefined) {
      return this.resolvedBasePath;
    }

    try {
      const fs = (eval('require') as any)('fs');
      const path = (eval('require') as any)('path');
      let current = __dirname;
      for (let i = 0; i < 5; i += 1) {
        const candidate = path.join(current, 'browser', 'assets', 'i18n');
        if (fs.existsSync(candidate)) {
          this.resolvedBasePath = candidate;
          return candidate;
        }
        const parent = path.dirname(current);
        if (parent === current) {
          break;
        }
        current = parent;
      }
    } catch {
      // fall through to null
    }

    this.resolvedBasePath = null;
    return null;
  }

  getTranslation(lang: string): Observable<any> {
    try {
      const fs = (eval('require') as any)('fs');
      const path = (eval('require') as any)('path');
      const basePath = this.resolveBasePath();
      if (!basePath) {
        return of({});
      }
      const filePath = path.join(basePath, `${lang}.json`);

      if (!fs.existsSync(filePath)) {
        return of({});
      }

      const content = fs.readFileSync(filePath, 'utf8');
      return of(JSON.parse(content));
    } catch {
      return of({});
    }
  }
}
