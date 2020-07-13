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
import { ConfirmEmailComponent } from 'src/app/components/modal/confirm-email/confirm-email.component';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { CvOptionModalComponent } from '../../components/modal/cv-option/cv-option-modal.component';
import { CvOptionComponent } from 'src/app/components/sheet/cv-option/cv-option.component';

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
  public childrenRoutes: boolean;
  public cvOption$: Observable<any>;

  constructor(
    public rf: ChangeDetectorRef,
    public downloadFileService: DownloadFileService,
    private router: Router,
    private profileService: ProfileService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog,
    private uploadFileService: UploadFileService,
    private globalErrorService: GlobalErrorService,
    private notificationService: NotificationService,

  ) {
    this.childrenRoutes = false;
    this.categories = [
      { name: 'Persönliches <br> & Kontakt', icon: 'category-01', path: ['profile/personal'] },
      { name: 'Ausbildung', icon: 'category-02', path: ['profile/education'] },
      { name: 'Beruflicher <br> Werdegang', icon: 'category-03', path: ['profile/professional-background'] },
      { name: 'Such- <br> Präferenzen', icon: 'category-04', path: ['profile/search-settings'] },
      { name: 'Dokumente', icon: 'category-05', path: ['profile/document'] },
      { name: 'Sonstiges', icon: 'category-06', path: ['profile/miscellaneous'] },
      { name: 'Ich über mich', icon: 'category-07', path: ['profile/about'] }
    ];
  }

  ngOnInit() {
    this.init();
  }

  onActivate() {
    this.childrenRoutes = !this.childrenRoutes;
  }
  onDeactivate() {
    this.childrenRoutes = !this.childrenRoutes;
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        switchMap( data => {
          if (!localStorage.getItem('SHOW_CONFIRM_EMAIL') && !data.isEmailConfirmed) {
            this.matDialog.open(ConfirmEmailComponent, { data: { firstName: data.profile.personal.firstName}, panelClass: 'confirm-email-dialog' }).afterClosed()
              .pipe()
              .subscribe(
                res => {
                  localStorage.setItem('SHOW_CONFIRM_EMAIL', 'true');
                }
              );
          }
          return of(data);
        })
      )
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
          this.globalErrorService.handleError(err);
        },
        () => {
          console.log('[ PROFILE DONE ]');
        }
      );
  }

  public onPdfOption = () => {
    if (window.innerWidth < 568) {
      this.cvOption$ = this.bottomSheet.open(CvOptionComponent, { panelClass: 'cv-option-sheet' }).afterDismissed();
    } else {
      this.cvOption$ = this.matDialog.open(CvOptionModalComponent, { panelClass: 'cv-option-dialog' }).afterClosed();
    }
    this.cvOption$
      .pipe()
      .subscribe(
        res => {
          if (res === 'download') {
            this.downloadFileService.downloadCandidateCv();
          }
          if (res === 'open') {
            this.downloadFileService.openCandidateCv();
          }
        },
        err => {
          console.log('[ PDF OPTION ERROR ]', err);
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
    return this.matDialog.open(CropperComponent, { data: fileData, panelClass: 'cropper-modal' }).afterClosed();
  }

  public showEditCategory = (router?: string) => {
    if (router) {
      this.router.navigate([router]);
    }
  }
}
