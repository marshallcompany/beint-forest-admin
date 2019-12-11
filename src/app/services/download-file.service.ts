import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';

import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider
  ) { }

  public downloadCandidateCv = () => {
    this.http.get(this.apiRoutes.GET_CANDIDATE_CV, {
      headers: new HttpHeaders({ 'Content-Type': 'application/pdf' }), responseType: 'blob'
    })
      .pipe()
      .subscribe(
        blob => {
          saveAs(blob, 'candidate_cv.pdf');
        },
        err => console.log('[ ERROR DOWNLOAD CV ]', err),
        () => console.log('[ DONE DOWNLOAD CV ]')
      );
  }
}
