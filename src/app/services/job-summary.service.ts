import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JobSummaryService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {}

  public createJobSummary = (data): Observable<any> => {
    return this.http.post<any>(this.apiRoutes.CREATE_JOB_SUMMARY, data);
  }

}
