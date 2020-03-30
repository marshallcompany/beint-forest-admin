import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { MatBottomSheet } from '@angular/material';
import { ImageChoiceComponent } from 'src/app/components/sheet/image-choice/image-choice.component';

import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { throwError, of, Observable, forkJoin } from 'rxjs';
import { CropperComponent } from 'src/app/components/modal/cropper/cropper.component';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { NotificationService } from 'src/app/services/notification.service';

interface Category {
  name: string;
  icon: string;
  path: Array<string>;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileDate;
  public categories: Array<Category>;
  public imageUrl: string;
  public spinner = false;

  constructor(
    public rf: ChangeDetectorRef,
    private router: Router,
    private profileService: ProfileService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog,
    private uploadFileService: UploadFileService,
    private globalErrorService: GlobalErrorService,
    private notificationService: NotificationService,
  ) {
    this.categories = [
      { name: 'Persönliches & Kontakt', icon: '../assets/image/profile/category-01.svg', path: ['personal'] },
      { name: 'Berufliche Ausbildung', icon: '../assets/image/profile/category-02.svg', path: ['education'] },
      { name: 'Beruflicher Werdegang', icon: '../assets/image/profile/category-03.svg', path: ['professional-background'] },
      { name: 'Such-Präferenzen', icon: '../assets/image/profile/category-04.svg', path: ['search-settings'] },
      { name: 'Dokumente', icon: '../assets/image/profile/category-05.svg', path: ['document'] },
      { name: 'Sonstiges', icon: '../assets/image/profile/category-06.svg', path: ['personal'] },
      { name: 'Ich über mich', icon: '../assets/image/profile/category-07.svg', path: ['about'] }
    ];
  }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe()
      .subscribe(
        res => {
          this.profileDate = res;
          if (res && res.media && res.media.avatar && res.media.avatar.storagePath) {
            this.imageUrl = res.media.avatar.storagePath;
          }
          console.log(this.profileDate);
        },
        err => {
          console.log('[ PROFILE ERROR ]', err);
        },
        () => {
          console.log('[ PROFILE DONE ]');
        }
      );
  }

  public takeProfilePicture = () => {
    this.bottomSheet.open(ImageChoiceComponent).afterDismissed()
      .pipe(
        switchMap(selectedFile => {
          if (!selectedFile || selectedFile === undefined) {
            return throwError('NO_FILE');
          }
          if (selectedFile.target.files[0] && selectedFile.target.files[0].size > 5000000) {
            return throwError(new Error('Sorry, the maximum file size is 5MB'));
          }
          return of(selectedFile);
        }),
        switchMap(targetFile => {
          return this.openCropperDialog(targetFile);
        }),
        switchMap(cropperValue => {
          if (!cropperValue || cropperValue === undefined) {
            return throwError('CROPPER_CLOSED');
          }
          return of(cropperValue);
        }),
        switchMap((base64: string) => {
          return fetch(base64).then(base64Url => base64Url.blob());
        })
      )
      .subscribe(
        res => {
          this.uploadImage(res, res.type);
          console.log('CROPPER EVENT', res);
        },
        err => {
          console.log('ERROR', err);
          if (err === 'NO_FILE' || err === 'CROPPER_CLOSED') {
            return;
          } else {
            this.globalErrorService.handleError(err);
          }
        }
      );
  }

  public uploadImage = (blob: Blob, type: string) => {
    this.spinner = true;
    this.uploadFileService.getUploadAvatarLink()
      .pipe(
        switchMap(urlS3 => {
          const arr: Array<Observable<any>> = [
            this.uploadFileService.uploadImage(urlS3.signedUploadUrl, blob, type),
            of(urlS3)
          ];
          return forkJoin(arr);
        }),
        switchMap(([s3answer, urlS3]) => {
          const avatar = {
            filename: type,
            mimeType: type,
            storagePath: urlS3.storagePath
          };
          return this.uploadFileService.updateAvatarModel(avatar);
        })
      )
      .subscribe(
        res => {
          console.log('UPLOAD IMAGE', res);
          this.init();
          this.notificationService.notify(`Picture saved successfully!`, 'success');
          this.spinner = false;
        },
        err => {
          console.log('UPLOAD IMAGE ERROR', err);
          this.globalErrorService.handleError(err);
          this.spinner = false;
        }
      );
  }

  openCropperDialog(fileData): Observable<any> {
    return this.matDialog.open(CropperComponent, { data: fileData }).afterClosed();
  }

  public showEditCategory = (router?: string) => {
    if (router) {
      this.router.navigate([router]);
    }
  }
}
