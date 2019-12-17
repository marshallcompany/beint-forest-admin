import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiRoutesProvider } from './api-routes.services';
import { GlobalErrorService } from './global-error-service';

import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(
    private http: HttpClient,
    private apiRoutes: ApiRoutesProvider,
    private globalErrorService: GlobalErrorService
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
        err => {
          console.log('[ ERROR DOWNLOAD CV ]', err);
          this.globalErrorService.handleError(err);
        },
        () => console.log('[ DONE DOWNLOAD CV ]')
      );
  }
}
