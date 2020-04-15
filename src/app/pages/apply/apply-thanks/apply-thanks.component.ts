import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from 'src/app/services/application-service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-apply-thanks',
  templateUrl: './apply-thanks.component.html',
  styleUrls: ['./apply-thanks.component.scss']
})
export class ApplyThanksComponent implements OnInit {

  public vacancyData;
  public jobId;
  constructor(
    public route: ActivatedRoute,
    public applicationService: ApplicationService,
  ) { }

  ngOnInit(): void {
    this.getJobData();
  }

  public getJobData = () => {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.applicationService.getJobData(this.jobId)
      .pipe(
        map((fullJobData: any) => {
          if (fullJobData && fullJobData.vacancy) {
            return {
              companyName: fullJobData.vacancy.company.profile.general.companyName,
            };
          }
          return fullJobData;
        })
      )
      .subscribe(
        data => {
          console.log('DATA JOB', data);
          this.vacancyData = data;
          setTimeout(() => {
            window.close();
          }, 5000);
        },
        err => {
          console.log('error', err);
        },
        () => console.log('[ DATA JOB DONE ]')
      );
  }
}
