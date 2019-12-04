import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      this.profileData = await this.profileService.getProfile();
      this.jobId = this.route.snapshot.paramMap.get('jobId') || localStorage.getItem('JOB_ID');
      if (this.jobId) {
        await this.profileService.apply(this.jobId);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
