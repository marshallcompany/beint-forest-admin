import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { TranslatesService } from './translates.service';

@Injectable()
export class AuthService {

  private readonly STORAGE_TOKEN_KEY: string;
  private readonly STORAGE_REFRESH_TOKEN: string;

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider,
    private translatesService: TranslatesService
  ) {
    this.STORAGE_TOKEN_KEY = 'JWT_TOKEN';
    this.STORAGE_REFRESH_TOKEN = 'REFRESH_TOKEN';
  }

  private saveAuthData(authData) {
    localStorage.setItem(this.STORAGE_TOKEN_KEY, authData.token);
    localStorage.setItem(this.STORAGE_REFRESH_TOKEN, authData.refreshToken);
  }

  public getAuthData(): string {
    return localStorage.getItem(this.STORAGE_TOKEN_KEY);
  }

  public async login({ email, password }): Promise<any> {
    const authData = await this.http.post<any>(this.apiRoutes.LOGIN, { email, password }).toPromise();
    if (authData && authData.refreshToken && authData.token) {
      this.saveAuthData(authData);
    }
    return !!authData;
  }

  public logout = () => {
    localStorage.clear();
    this.translatesService.initLanguage();
  }

}
