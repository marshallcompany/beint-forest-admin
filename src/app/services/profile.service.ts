import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public getProfile() {
    return this.http.get<any>(this.apiRoutes.PROFILE);
  }

  public getQuestion = () => {
    return this.http.get<any>(this.apiRoutes.GET_QUESTION);
  }

  public getLocalBundle = (local) => {
    const url = this.apiRoutes.GET_LOCAL_BUNDLE.replace(':lang', local);
    return this.http.get<any>(url);
  }

  public updateProfile(data) {
    return this.http.patch<any>(this.apiRoutes.PROFILE, data);
  }

  public createSkills(data: object, lang?: string) {
    const url = this.apiRoutes.CREATE_SKILLS.replace(':lang', lang ? lang : '');
    return this.http.post<any>(url, data);
  }

}
