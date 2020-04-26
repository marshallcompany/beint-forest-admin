import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  public readonly JOB_ID: string;

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {
    this.JOB_ID = 'JOB_ID';
  }

  public saveJobId = (id: any) => {
    localStorage.setItem(this.JOB_ID, id);
  }

  public getJobId = () => {
    return localStorage.getItem(this.JOB_ID);
  }

  public removeJobId = () => {
    return localStorage.removeItem(this.JOB_ID);
  }

  public jobApply = (id: string) => {
    const url = this.apiRoutes.JOB_VACANCIES.replace(':id', id);
    return this.http.put<any>(url, {});
  }

  public getJobData = (id: string) => {
    const url = this.apiRoutes.GET_JOB_DATA.replace(':id', id);
    return this.http.get<any>(url, {});
  }

  public getAllJob = () => {
    return this.http.get<any>(this.apiRoutes.GET_VACANCIES);
  }

}

