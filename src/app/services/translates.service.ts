import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Languages {
  name: string;
  code: string;
}
@Injectable({
  providedIn: 'root'
})
export class TranslatesService {
  public readonly STORAGE_LANG_CODE: string = 'LANG_CODE';

  public languagesSelect: Array<Languages>;
  constructor(
    public translateService: TranslateService
  ) {
    this.languagesSelect = [
      {
        name: 'English',
        code: 'en'
      },
      {
        name: 'Germany',
        code: 'de'
      },
    ];
  }

  public initLanguage = () => {
    if (localStorage.getItem(this.STORAGE_LANG_CODE) !== null) {
      const localLang = localStorage.getItem(this.STORAGE_LANG_CODE);
      this.translateService.use(localLang);
    } else {
      this.setLanguage();
    }
  }

  public setLanguage = () => {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.addLangs(this.languagesSelect.map((lang: Languages) => lang.code));
    this.translateService.setDefaultLang('de');
    this.translateService.use(browserLang.match(/de/) ? browserLang : 'de');
    // /en|de/
  }

  public changeLanguageCode = (code: string) => {
    this.translateService.use(code);
    localStorage.setItem(this.STORAGE_LANG_CODE, code);
  }

  public getCurrentLang = () => {
    return this.translateService.currentLang;
  }

}
