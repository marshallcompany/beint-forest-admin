import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileData: object;
  public jobId: string;

  constructor(
    private profileService: ProfileService
  ) { }

  async ngOnInit() {
    try {
      this.profileData = await this.profileService.getProfile();
      console.log('profile', this.profileData);
    } catch (error) {
      console.log('error', error);
    }
  }
}
