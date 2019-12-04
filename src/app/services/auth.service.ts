import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface Authdata {
  token: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {

  private readonly STORAGE_TOKEN_KEY: string;
  private readonly STORAGE_REFRESH_TOKEN: string;
  private readonly JOB_ID: string;

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {
    this.STORAGE_TOKEN_KEY = 'JWT';
    this.STORAGE_REFRESH_TOKEN = 'REFRESH_TOKEN';
    this.JOB_ID = 'JOB_ID';
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
    localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    localStorage.removeItem(this.STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(this.JOB_ID);
  }

}
