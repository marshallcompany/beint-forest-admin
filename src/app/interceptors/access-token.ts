import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { catchError, filter, take, switchMap } from 'rxjs/operators';

@Injectable()

export class AccessTokenInterceptor implements HttpInterceptor {

  private jwt: string;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private auth: AuthService,

  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.jwt = this.auth.getAuthData();

    if (this.jwt) {
      req = this.addAuthenticationToken(req);
    }

    return next.handle(req)
      .pipe(
        catchError(error => {
          console.log('intercept error', error);
          if (error && error.status === 401 && error.error.message === 'CREDENTIALS_NOT_VALID') {
            return throwError(error);
          }
          if (error && error.status !== 401) {
            return throwError(error);
          }
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject
              .pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.addAuthenticationToken(req)))
              );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);
            return this.auth.refreshToken()
              .pipe(
                switchMap((token: any) => {
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(token);
                  return next.handle(this.addAuthenticationToken(req));
                }),
                catchError(err => {
                  this.refreshTokenInProgress = false;
                  if (err.status === 403 || err.status === 401) {
                    this.auth.logout();
                  } else {
                    return next.handle(this.addAuthenticationToken(req));
                  }
                })
              );
          }
        })
      );
  }

  private addAuthenticationToken(req) {
    this.jwt = this.auth.getAuthData();
    if (this.jwt) {
      return req = req.clone({
        setHeaders: {
          'x-access-token': this.jwt
        }
      });
    }
    return req;
  }
}
