import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  public canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // tslint:disable-next-line:no-string-literal
    const jobId = activatedRouteSnapshot.params['jobId'];

    if (jobId) {
      localStorage.setItem('JOB_ID', jobId);
    }

    if (!this.auth.getAuthData()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
