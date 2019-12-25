import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService, Profile } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileData: Profile;

  public editProfileStatus: boolean;
  public categoryState: Array<any>;

  constructor(
    private profileService: ProfileService,
    private globalErrorService: GlobalErrorService,
    private router: Router
  ) {
    this.editProfileStatus = false;
  }

  ngOnInit() {
    this.init();
  }

  private init = () => {
    this.profileService.getProfile()
      .pipe()
      .subscribe(
        data => {
          this.profileData = data;
          console.log('[ PROFILE DATA ]', this.profileData);
        },
        err => {
          this.globalErrorService.handleError(err);
          console.log('[ ERROR PROFILE DATA ]', err);
        },
        () => console.log('[ PROFILE DATA DONE ]')
      );
  }
  public showEditCategory = (router?: string) => {
    this.editProfileStatus = !this.editProfileStatus;
    if (router) {
      this.router.navigate([router]);
    }
  }
}
