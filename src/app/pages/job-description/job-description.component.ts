import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApplicationService } from '../../services/application-service';
import { DownloadFileService } from '../../services/download-file.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-job-description',
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {

  public jobId: string;
  public jobData: any;
  public applicationSuccess: boolean;
  public noJodData: boolean;
  public statusButtonApply: boolean;
  constructor(
    public router: Router,
    public applicationService: ApplicationService,
    public downloadFileService: DownloadFileService,
    public route: ActivatedRoute
  ) {
    this.noJodData = false;
    this.statusButtonApply = false;
  }

  async ngOnInit() {
    try {
      this.jobId = this.route.snapshot.paramMap.get('jobId') || this.applicationService.getJobId();
      this.jobData = await this.applicationService.getJobData(this.jobId);
      if (this.jobData && this.jobData.meta && this.jobData.meta.pendingApplication && this.jobData.meta.pendingApplication) {
        this.applicationSuccess = true;
        this.statusButtonApply = true;
      }
    } catch (error) {
      console.log('ERROR JOB', error);
      this.noJodData = true;
      this.statusButtonApply = true;
    }
  }

  async jobApply() {
    try {
      if (this.jobId) {
        await this.applicationService.apply(this.jobId);
        this.applicationService.removeJobId();
        this.applicationSuccess = true;
        this.statusButtonApply = true;
        setTimeout(() => {
          window.close();
        }, 5000);
      }
    } catch (error) {
      alert(error.error.message);
      console.log('ERROR APPLY JOB', error);
      this.applicationService.removeJobId();
    }
  }

  public goToProfile = () => {
    this.router.navigate(['/profile']);
  }

  public downloadFile = () => {
    this.downloadFileService.downloadCandidateCv();
  }
}
