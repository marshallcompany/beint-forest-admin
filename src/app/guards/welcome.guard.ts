import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WelcomeGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.getAuthData()) {
      this.router.navigate(['/company/create']);
      return false;
    }
    return true;
  }
}
