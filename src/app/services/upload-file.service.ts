import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public getUploadAvatarLink = () => {
    return this.http.get<any>(this.apiRoutes.GET_LINK_IMAGE);
  }

  public uploadImage = (url: string, image: Blob, type: string) => {
    return this.http.put<any>(url, image, {
      headers: new HttpHeaders({ 'Content-Type': `${type}` })
    });
  }

  public updateAvatarModel = (data: object) => {
    return this.http.post<any>(this.apiRoutes.UPDATE_PROFILE_AVATAR, data);
  }


  public getUploadDocumentLink = () => {
    return this.http.get<any>(this.apiRoutes.GET_LINK_DOCUMENT);
  }

  public uploadDocument = (url: string, image: Blob, type: string) => {
    return this.http.put<any>(url, image, {
      headers: new HttpHeaders({ 'Content-Type': `${type}` })
    });
  }

  public removeDocument = (id: string) => {
    const url = this.apiRoutes.REMOVE_DOCUMENT.replace(':id', id);
    return this.http.delete<any>(url);
  }

  public updateDocumentModel = (data: object) => {
    return this.http.post<any>(this.apiRoutes.UPDATE_PROFILE_DOCUMENT, data);
  }

  public updateDocument = (id: string, data: object) => {
    const url = this.apiRoutes.REMOVE_DOCUMENT.replace(':id', id);
    return this.http.patch<any>(url, data);
  }
  public convertToBase64(fileToRead: File): Observable<any> {
    const base64Observable = new ReplaySubject<any>(1);
    const fileReader = new FileReader();
    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);
    return base64Observable;
  }

}
