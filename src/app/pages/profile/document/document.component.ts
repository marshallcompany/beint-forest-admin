import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, ReplaySubject, of, forkJoin, throwError } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-05.svg',
    nameCategory: 'Dokumente',
    nextCategory: 'about',
    prevCategory: 'search-settings'
  };

  public profileDate;

  constructor(
    private profileService: ProfileService,
    private uploadFileService: UploadFileService
  ) { }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        map((fullProfileData: any) => {
          if (fullProfileData.profile && fullProfileData.profile.miscellaneous && fullProfileData.profile.miscellaneous.documents) {
            return {
              documents: fullProfileData.profile.miscellaneous.documents,
            };
          }
          return fullProfileData;
        })
      )
      .subscribe(
        res => {
          this.profileDate = res;
          console.log('[ DOCUMENT DATE ]', this.profileDate);
        },
        err => {
          console.log('[ DOCUMENT ERROR ]', err);
        },
        () => {
          console.log('[ DOCUMENT DONE ]');
        }
      );
  }

  public fileSelect = ($event) => {
    let urlFile: string;
    let typeFile: string;
    let nameFile: string;
    nameFile = $event.target.files[0].name;
    this.uploadFileService.convertToBase64($event.target.files[0])
      .pipe(
        switchMap((base64: string) => {
          return fetch(base64).then(base64Url => base64Url.blob());
        }),
        switchMap((blob: Blob) => {
          const arr: Array<Observable<any>> = [
            this.uploadFileService.getUploadDocumentLink(),
            of(blob)
          ];
          return forkJoin(arr);
        }),
        switchMap(([urlS3, blob]) => {
          urlFile = urlS3.storagePath;
          typeFile = blob.type;
          return this.uploadFileService.uploadDocument(urlS3.signedUploadUrl, blob, blob.type);
        }),
        switchMap(answerS3 => {
          if (answerS3 === null) {
            const documentData = {
              filename: nameFile,
              mimeType: typeFile,
              storagePath: urlFile
            };
            return this.uploadFileService.updateDocumentModel(documentData);
          }
          return throwError('[ UPLOAD ERROR ]');
        })
      )
      .subscribe(
        res => {
          console.log('upload document', res);
          console.log('urlS3', urlFile);
          this.init();
        },
        err => {
          console.log('[ UPLOAD DOCUMENT ERROR ]', err);
        }
      );
  }
  removeDocument(id) {
    this.uploadFileService.removeDocument(id)
      .pipe()
      .subscribe(
        res => {
          this.init();
        }
      );
  }
}
