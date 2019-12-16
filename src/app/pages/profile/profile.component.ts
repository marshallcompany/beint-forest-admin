import { Component, OnInit } from '@angular/core';

import { ProfileService, Profile } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileData: Profile;

  constructor(
    private profileService: ProfileService,
    private globalErrorService: GlobalErrorService
  ) { }

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
}
