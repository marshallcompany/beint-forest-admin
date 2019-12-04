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

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.applicationSuccess = false;
  }

  async ngOnInit() {
    try {
      this.jobId = this.route.snapshot.paramMap.get('jobId') || this.applicationService.getJobId();
      if (this.jobId) {
        await this.applicationService.apply(this.jobId);
        this.applicationService.removeJobId();
        this.applicationSuccess = true;

        setTimeout(() => {
          window.close();
        }, 3000);
      }
    } catch (error) {
      console.log('error', error);
      this.applicationSuccess = false;
      this.applicationService.removeJobId();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
