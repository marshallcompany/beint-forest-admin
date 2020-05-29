import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { TranslatesService } from './translates.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  private readonly STORAGE_TOKEN_KEY: string;
  private readonly STORAGE_REFRESH_TOKEN: string;

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider,
    private translatesService: TranslatesService,
    private router: Router
  ) {
    this.STORAGE_TOKEN_KEY = 'JWT_TOKEN';
    this.STORAGE_REFRESH_TOKEN = 'REFRESH_TOKEN';
  }

  public saveAuthData(authData) {
    localStorage.setItem(this.STORAGE_TOKEN_KEY, authData.token);
    localStorage.setItem(this.STORAGE_REFRESH_TOKEN, authData.refreshToken);
  }

  public getAuthData(): string {
    return localStorage.getItem(this.STORAGE_TOKEN_KEY);
  }

  public refreshToken = () => {
    const url = this.apiRoutes.REFRESH_TOKEN.replace(':refreshTokenId', localStorage.getItem('REFRESH_TOKEN'));
    return this.http.post<any>(url, {})
      .pipe(
        tap(authResult => {
          this.saveAuthData(authResult);
        })
      );
  }

  public updateUserPassword = (passwords: object) => {
    return this.http.patch<any>(this.apiRoutes.UPDATE_PASSWORD, passwords);
  }

  public updateUserPasswordEmail = (email: object) => {
    return this.http.post<any>(this.apiRoutes.UPDATE_PASSWORD_MAIL, email);
  }

  public removeAccount = () => {
    return this.http.delete<any>(this.apiRoutes.REMOVE_ACCOUNT);
  }

  public async login({ email, password }): Promise<any> {
    const authData = await this.http.post<any>(this.apiRoutes.LOGIN, { email, password }).toPromise();
    if (authData && authData.refreshToken && authData.token) {
      this.saveAuthData(authData);
    }
    return !!authData;
  }

  public resendVerificationEmail = () => {
    return this.http.post<any>(this.apiRoutes.RESEND_VERIFICATION_EMAIL, {});
  }

  public registration = (data: object) => {
    return this.http.post<any>(this.apiRoutes.REGISTRATION, data);
  }

  public logout = () => {
    localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    localStorage.removeItem(this.STORAGE_REFRESH_TOKEN);
    localStorage.removeItem('SHOW_CONFIRM_EMAIL');
    this.translatesService.initLanguage();
    this.router.navigate(['/auth/login']);
  }

}
