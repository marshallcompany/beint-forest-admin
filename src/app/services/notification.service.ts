import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) { }

  private show = (message: string, type?: string) => {
    this.snackbar.open(`${message}`, `X`, {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: type ? `snackbar-${type}` : 'snackbar-error'
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
