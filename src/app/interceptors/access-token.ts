import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()

export class AccessTokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloned = req.clone({
        setHeaders: {
        'x-access-token': this.authService.getJwtToken() ? this.authService.getJwtToken() : null
        }
    });
    return next.handle(cloned);
  }
}
