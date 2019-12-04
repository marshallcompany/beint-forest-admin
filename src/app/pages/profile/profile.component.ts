import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application-service';
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
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      this.profileData = await this.profileService.getProfile();
      this.jobId = this.route.snapshot.paramMap.get('jobId') || this.applicationService.getJobId();
      if (this.jobId) {
        await this.applicationService.apply(this.jobId);
        this.applicationService.removeJobId();
      }
    } catch (error) {
      console.log('error', error);
      this.applicationService.removeJobId();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
