import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorService implements ErrorHandler {

  constructor(
    private injector: Injector,
  ) { }

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const notificationService = this.injector.get(NotificationService);
    let message: any;
    if (error instanceof HttpErrorResponse) {
      // Server Error
      if (!error.error.hiddenNotification) {
        message = errorService.getServerMessage(error);
        notificationService.notify(message);
      }
    } else {
      // Client Error
      message = errorService.getClientMessage(error);
      notificationService.notify(message);
    }
    if (environment.production) {
      console.log('ERRRORR');
    } else {
      console.log('[ ERROR ]', error);
    }
  }
}