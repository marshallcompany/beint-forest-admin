import { Component, OnInit, Input } from '@angular/core';
import { PrivacyPolicyComponent } from '../modal/privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { ApplicationService } from 'src/app/services/application-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details-vacancy',
  templateUrl: './details-vacancy.component.html',
  styleUrls: ['./details-vacancy.component.scss']
})
export class DetailsVacancyComponent implements OnInit {

  @Input() vacancyData;
  @Input() newVacancyDesign;

  public privacyPolicy;

  constructor(
    public matDialog: MatDialog,
    public applicationService: ApplicationService,
    public router: Router,
    private globalErrorService: GlobalErrorService
  ) { }

  ngOnInit() {
  }

  public openPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

  public applyVacancy = (id: string) => {
    const jobApply$ = this.applicationService.jobApply(id);
    jobApply$
      .pipe()
      .subscribe(
        res => {
          this.applicationService.removeJobId();
          this.router.navigate([`/apply-thanks/${id}/keep/true`]);
        },
        err => {
          console.log('[ ERROR APPLY JOB ]', err);
          this.applicationService.removeJobId();
          this.globalErrorService.handleError(err);
        },
        () => console.log('[ DONE APPLY JOB ]')
      );
  }
}
