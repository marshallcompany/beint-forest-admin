import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DocumentOptionComponent } from 'src/app/components/sheet/document-option/document-option.component';
import { DocumentOptionModalComponent } from 'src/app/components/modal/document-option/document-option-modal.component';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import { FileRenameComponent } from 'src/app/components/modal/file-rename/file-rename.component';

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
  public documentOption$: Observable<any>;

  constructor(
    private profileService: ProfileService,
    private uploadFileService: UploadFileService,
    private bottomSheet: MatBottomSheet,
    private globalErrorService: GlobalErrorService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
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
          console.log('[ UPLOAD DOCUMENT DONE ]', res);
          this.init();
          this.notificationService.notify(`Document saved successfully!`, 'success');
        },
        err => {
          console.log('[ UPLOAD DOCUMENT ERROR ]', err);
        }
      );
  }


  documentOption(document) {
    let statusChange: string;
    const confirmConfig = {
      title: 'Wirklich löschen?',
      labelConfirmButton: 'Löschen',
      labelCancelButton: 'Abbrechen'
    };
    if (window.innerWidth < 568) {
      this.documentOption$ = this.bottomSheet.open(DocumentOptionComponent).afterDismissed();
    } else {
      this.documentOption$ = this.matDialog.open(DocumentOptionModalComponent).afterClosed();
    }
    this.documentOption$
      .pipe(
        switchMap((value: any) => {
          console.log(value);
          if (value === undefined) {
            return throwError('NO OPTION');
          }
          statusChange = value;
          return of(value);
        }),
        switchMap((remove: string) => {
          if (remove === 'remove') {
            return this.matDialog.open(ConfirmModalComponent, { data: confirmConfig }).afterClosed()
              .pipe(
                switchMap(value => {
                  if (!value || value === undefined) {
                    return throwError('NO OPTION');
                  }
                  return this.uploadFileService.removeDocument(document._id);
                })
              );
          }
          return of(remove);
        }),
        switchMap((rename: string) => {
          if (rename === 'rename') {
            return this.matDialog.open(FileRenameComponent).afterClosed()
              .pipe(
                switchMap(value => {
                  if (!value || value === undefined) {
                    return throwError('NO OPTION');
                  }
                  return this.uploadFileService.updateDocument(document._id, { filename: value });
                })
              );
          }
          return of(rename);
        }),
        switchMap((open: string) => {
          if (open === 'open') {
            return of(window.open(document.storagePath));
          }
          return of(open);
        })
      )
      .subscribe(
        res => {
          console.log('res', res);
          if (statusChange === 'remove' || statusChange === 'rename') {
            this.notificationService.notify(`Document saved successfully!`, 'success');
            this.init();
          }
        },
        err => {
          console.log('ERROR', err);
          if (err === 'NO OPTION') {
            return;
          } else {
            this.globalErrorService.handleError(err);
          }
        }
      );
  }
}
