import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiRoutesProvider } from '../api-routes/api-routes';

import { Observable } from 'rxjs';

@Injectable()
export class RestProvider {

    private BASE_API_URL: string;

    constructor(
        public http: HttpClient,
        private apiRoutes: ApiRoutesProvider
    ) {
        this.BASE_API_URL = this.apiRoutes.BASE_API_URL;
    }

    public get<T>(url, queryParams?): Observable<T> {
        url = `${this.BASE_API_URL}${url}`;
        return this.http.get<T>(url);
    }
    
    public post<T>(url: string, body = {}, queryParams?: object): Observable<T> {
        url = `${this.BASE_API_URL}${url}`;
        return this.http.post<T>(`${url}`, body);
    }


    public put<T>(url: string, body?: object, queryParams?: object): Observable<T> {
        url = `${this.BASE_API_URL}${url}`;
        return this.http.put<T>(`${url}`, {});
    }

}