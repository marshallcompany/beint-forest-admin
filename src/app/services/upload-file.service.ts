import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public getUploadLink = () => {
    return this.http.get<any>(this.apiRoutes.GET_LINK_IMAGE);
  }

  public uploadImage = (url: string, image: Blob, type: string) => {
    return this.http.put<any>(url, image, {
      headers: new HttpHeaders({ 'Content-Type': `${type}` })
    });
  }

}
