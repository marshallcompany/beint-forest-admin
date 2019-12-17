import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application-service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  public jobId: string;
  public applicationSuccess: boolean;
  public applicationError: boolean;
  public jobData: object;

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.applicationError = false;
  }

  async ngOnInit() {
    try {
      this.jobId = this.route.snapshot.paramMap.get('jobId') || this.applicationService.getJobId();
      this.jobData = await this.applicationService.getJobData(this.jobId);
      console.log(this.jobData);
      if (this.jobId) {
        await this.applicationService.jobApply(this.jobId);
        this.applicationService.removeJobId();
        this.applicationSuccess = true;

        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } catch (error) {
      console.log('error', error);
      this.applicationSuccess = false;
      this.applicationError = true;
      this.applicationService.removeJobId();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
