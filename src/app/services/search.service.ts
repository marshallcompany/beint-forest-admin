import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {
  }

  public getBusinessBranches = (lang, params) => {
    const url = this.apiRoutes.GET_BUSINESS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  };
  public getIndustryBranches = (lang, params) => {
    const url = this.apiRoutes.GET_INDUSTRY_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  };
  public getBenefits = (lang, params) => {
    const url = this.apiRoutes.GET_BENEFITS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
      }
    });
  };
  public getTowns = (lang, params, zip = '') => {
    const url = this.apiRoutes.GET_TOWNS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params,
        country: 'Deutschland',
        zip
      }
    });
  };

  public getCountries(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_COUNTRIES_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

  public getSpecializationUniversity(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_SPECIALIZATION_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

  public getDegreeUniversity(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_DEGREE_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

  public getProfessionalEducation(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_EDUCATION_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

  public getZipCode(lang, country: string, city: string = '', filter: string = ''): Observable<string[]> {
    const url = this.apiRoutes.GET_ZIP_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: filter ? {
        country,
        filter,
        city,
      } : {
          country,
          city
        }
    });
  }

}
