import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

export interface Profile {
  createdAt?: string;
  email?: string;
  id?: string;
  profile?: object;
  role?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public getProfile() {
    return this.http.get<Profile>(this.apiRoutes.PROFILE);
  }

  public updateProfile(data) {
    return this.http.patch<any>(this.apiRoutes.PROFILE, data);
  }

}
