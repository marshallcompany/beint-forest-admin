import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth';

@Injectable()

export class AccessTokenInterceptor implements HttpInterceptor {

  private jwt: string;

  constructor(
    private auth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.jwt = this.auth.getAuthData();

    if (this.jwt) {
      const tokenReq: HttpRequest<any> = req.clone({
        headers: req.headers.set('x-access-token', this.jwt)
      });
      return next.handle(tokenReq);
    }
    return next.handle(req);
  }

}
