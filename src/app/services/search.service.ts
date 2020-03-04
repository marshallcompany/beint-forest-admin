import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public getBusinessBranches = (lang, params) => {
    const url = this.apiRoutes.GET_BUSINESS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  }
  public getIndustryBranches = (lang, params) => {
    const url = this.apiRoutes.GET_INDUSTRY_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  }
  public getBenefits = (lang, params) => {
    const url = this.apiRoutes.GET_BENEFITS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  }
  public getTowns = (lang, params) => {
    const url = this.apiRoutes.GET_TOWNS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  }
}
