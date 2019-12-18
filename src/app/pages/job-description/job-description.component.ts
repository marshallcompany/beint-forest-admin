import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApplicationService } from '../../services/application-service';
import { DownloadFileService } from '../../services/download-file.service';
import { NotificationService } from '../../services/notification.service';

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
  public rating: number;
  public ratingNumber: number;

  constructor(
    public router: Router,
    public applicationService: ApplicationService,
    public downloadFileService: DownloadFileService,
    public route: ActivatedRoute,
    public notificationService: NotificationService
  ) {
    this.noJodData = false;
    this.statusButtonApply = false;

  }

  ngOnInit() {
    this.init();
  }
  public init = () => {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || this.applicationService.getJobId();
    this.applicationService.getJobData(this.jobId)
      .pipe()
      .subscribe(
        data => {
          console.log('DATA JOB', data);
          this.jobData = data;
          this.animationRatingJob();
          if (this.jobData && this.jobData.meta && this.jobData.meta.pendingApplication && this.jobData.meta.pendingApplication) {
            this.applicationSuccess = true;
            this.statusButtonApply = true;
            localStorage.removeItem('JOB_ID');
          }
        },
        err => {
          console.log('[ DATA JOB ERROR ]', err);
          this.noJodData = true;
          this.statusButtonApply = true;
        },
        () => console.log('[ DATA JOB DONE ]')
      );
  }

  public animationRatingJob = () => {
    this.rating = 65;
    this.ratingNumber = 0;
    const set = setInterval(() => {
      if (this.ratingNumber !== this.rating) {
        this.ratingNumber++;
      } else {
        clearInterval(set);
      }
    }, 50);
  }

  public apply = () => {
    const jobApply$ = this.applicationService.jobApply(this.jobId);
    jobApply$
      .pipe()
      .subscribe(
        res => {
          this.applicationService.removeJobId();
          this.statusButtonApply = true;
          this.notificationService.notify('You have successfully applied to Job', 'success');
          setTimeout(() => {
            window.close();
          }, 5000);
        },
        err => {
          console.log('[ ERROR APPLY JOB ]', err);
          this.applicationService.removeJobId();
        },
        () => console.log('[ DONE APPLY JOB ]')
      );

  }

  public downloadFile = () => {
    this.downloadFileService.downloadCandidateCv();
  }

}
