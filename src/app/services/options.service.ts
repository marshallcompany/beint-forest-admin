import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OptionsService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {}

  public getBenefitsOptions = (lang, params): Observable<any> => {
    const url = this.apiRoutes.GET_BENEFITS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  }

  public getLocalBundle = (local): Observable<any> => {
    const url = this.apiRoutes.GET_LOCAL_BUNDLE.replace(':lang', local);
    return this.http.get<any>(url);
  }

}
