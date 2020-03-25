import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { MatBottomSheet } from '@angular/material';
import { ImageChoiceComponent } from 'src/app/bottom-sheet/image-sheet/image-choice/image-choice.component';

import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';
import { CropperComponent } from 'src/app/modal/cropper/cropper.component';

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
  public image: string;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog
  ) {
    this.categories = [
      { name: 'Persönliches & Kontakt', icon: '../assets/image/profile/category-01.svg', path: ['personal'] },
      { name: 'Berufliche Ausbildung', icon: '../assets/image/profile/category-02.svg', path: ['education'] },
      { name: 'Beruflicher Werdegang', icon: '../assets/image/profile/category-03.svg', path: ['professional-background'] },
      { name: 'Such-Präferenzen', icon: '../assets/image/profile/category-04.svg', path: ['search-settings'] },
      { name: 'Dokumente', icon: '../assets/image/profile/category-05.svg', path: ['personal'] },
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
        switchMap(value => {
          if (!value || value === undefined) {
            return throwError('[ NO FILE ]');
          }
          return of(value);
        }),
        switchMap(fileEvent => {
          return this.openCropperDialog(fileEvent);
        })
      )
      .subscribe(
        event => {
          this.image = event.base64;
          console.log('CROPER EVENT', event);
        },
        err => {
          console.log('ERROR', err);
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
