import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { ApplicationService } from 'src/app/services/application-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-details-vacancy',
  templateUrl: './details-vacancy.component.html',
  styleUrls: ['./details-vacancy.component.scss']
})
export class DetailsVacancyComponent implements OnInit, OnChanges {

  @Input() vacancyData;
  @Input() profileData;
  @Input() newVacancyDesign;

  public privacyPolicy;

  public resendEmailStatus = false;
  public loadingStatus = false;

  constructor(
    public matDialog: MatDialog,
    public applicationService: ApplicationService,
    public router: Router,
    private globalErrorService: GlobalErrorService,
    private auth: AuthService
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.privacyPolicy = false;
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

  public resendEmail = () => {
    this.loadingStatus = true;
    this.auth.resendVerificationEmail()
      .pipe()
      .subscribe(
        res => {
          console.log('[ RESEND VERIFICATION EMAIL RESULT ]', res);
          this.resendEmailStatus = !this.resendEmailStatus;
          this.loadingStatus = false;
        },
        error => {
          console.log('[ RESEND VERIFICATION EMAIL ERROR ]', error);
        }
      );
  }
}
