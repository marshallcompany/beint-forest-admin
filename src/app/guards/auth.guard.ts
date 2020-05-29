import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ApplicationService } from '../services/application-service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    public applicationService: ApplicationService
  ) { }

  public canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // tslint:disable-next-line:no-string-literal
    const jobId = activatedRouteSnapshot.params['jobId'];
    // tslint:disable-next-line:no-string-literal
    const keep = activatedRouteSnapshot.params['keep'];

    if (jobId && Boolean(keep)) {
      this.applicationService.saveJobId(jobId);
    }

    if (!this.auth.getAuthData()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
