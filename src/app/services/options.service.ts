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

  public getBusinessBranches = (lang, params) => {
    const url = this.apiRoutes.GET_BUSINESS_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: params
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

  public getSkills(lang): Observable<string[]> {
    const url = this.apiRoutes.GET_SKILLS.replace(':lang', lang);
    return this.http.get<any>(url);
  }

  public getLang(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_LANG_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

  public getJobSummaryAddres(id: string): Observable<string[]> {
    const url = this.apiRoutes.GET_JOB_SUMMARY_ADDRESS.replace(':id', id);
    return this.http.get<any>(url);
  }

  public getSpecializationUniversity(lang, query): Observable<string[]> {
    const url = this.apiRoutes.GET_SPECIALIZATION_SCHEMA.replace(':lang', lang);
    return this.http.get<any>(url, {
      params: {
        filter: query
      }
    });
  }

}
