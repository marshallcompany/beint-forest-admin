import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) {}

  public createCompany = (data): Observable<any> => {
    return this.http.post<any>(this.apiRoutes.CREATE_COMPANY, data);
  }

  public getCompany = (id: string): Observable<any> => {
    const url = this.apiRoutes.GET_COMPANY.replace(':id', id);
    return this.http.get<any>(url);
  }

  public updateCompany = (data, id: string): Observable<any> => {
    const url = this.apiRoutes.UPDATE_COMPANY.replace(':id', id);
    return this.http.patch<any>(url, data);
  }

}
