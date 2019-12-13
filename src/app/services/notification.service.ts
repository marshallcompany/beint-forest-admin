import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from 'ngx-snackbar';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snakbar: SnackbarService,
    private translate: TranslateService,
  ) { }

  private show = (mssg: string, type?: string) => {
    this.snakbar.add({
      msg: `${mssg}`,
      customClass: type ? `snackbar-${type}` : 'snackbar-error',
      timeout: 3000,
      action: {
        text: '/',
        onClick: () => { },
      },
    });
  }

  notify(msgCode?: string, type?: string) {
    this.translate.get(msgCode ? msgCode : 'global.default_error_message')
      .subscribe(
        translation => this.show(translation, type),
        err => {
          console.log('[ ERROR GET TRANSLATION NOTIFY ]', err);
          this.notify('Ooops! Something went wrong.');
        }
      );
  }
}
