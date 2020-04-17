import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { ProfileService } from 'src/app/services/profile.service';
import { map } from 'rxjs/operators';
import { ApplicationService } from 'src/app/services/application-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PrivacyPolicyComponent } from 'src/app/components/modal/privacy-policy/privacy-policy.component';
import { GlobalErrorService } from 'src/app/services/global-error-service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  @ViewChild('scrollToTop', { static: true }) scrollToTop;

  public profileData: object;
  public privacyPolicy;
  public vacancyData;
  public jobId;

  constructor(
    public downloadFileService: DownloadFileService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public applicationService: ApplicationService,
    public matDialog: MatDialog,
    private profileService: ProfileService,
    private globalErrorService: GlobalErrorService
  ) {
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.getJobData();
  }

  dataRefresh = () => {
    this.getUserProfile();
    this.scrollToTop.nativeElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  public getUserProfile = () => {
    if (this.authService.getAuthData()) {
      this.profileService.getProfile()
        .pipe(
          map((fullUserProfile: any) => {
            console.log('cccc', fullUserProfile);
            if (fullUserProfile) {
              return {
                firstName: fullUserProfile.profile.personal.firstName,
                avatar: fullUserProfile.media && fullUserProfile.media.avatar && fullUserProfile.media.avatar.storagePath ? fullUserProfile.media.avatar.storagePath : ''
              };
            }
            return fullUserProfile;
          })
        )
        .subscribe(
          res => {
            this.profileData = res;
            console.log('PROFILE DATA', res);
          }
        );
    }
    return;
  }

  public openGroup = (e) => {
    e.classList.add('acord-active');
  }

  public closeGroup = (e) => {
    e.classList.remove('acord-active');
  }

  public getJobData = () => {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.applicationService.getJobData(this.jobId)
      .pipe(
        map((fullJobData: any) => {
          console.log('FULL VACANCY DATA', fullJobData);
          if (fullJobData && fullJobData.vacancy) {
            return {
              companyName: fullJobData.vacancy.company.profile.general.companyName,
              place: fullJobData.vacancy.company.profile.contact.place,
              companyLogo: fullJobData.vacancy.company && fullJobData.vacancy.company.media && fullJobData.vacancy.company.media.logo &&
                fullJobData.vacancy.company.media.logo.storagePath
                ? fullJobData.vacancy.company.media.logo.storagePath : '',
              activationDate: fullJobData.vacancy.details.activationDate,
              industryBranch: fullJobData.vacancy.details.industryBranch,
              businessArea: fullJobData.vacancy.details.businessArea,
              employmentType: fullJobData.vacancy.details.employmentType,
              workingHours: fullJobData.vacancy.details.workingHours,
              jobTitle: fullJobData.vacancy.details.title,
              occupyAt: fullJobData.vacancy.details.occupyAt,
              topSkills: fullJobData.vacancy.candidateRequirements.primarySkills,
              skills: fullJobData.vacancy.candidateRequirements.secondarySkills,
              languages: fullJobData.vacancy.candidateRequirements.linguisticProficiency,
              careerLevel: fullJobData.vacancy.candidateRequirements.careerLevel,
              driverLicenses: fullJobData.vacancy.candidateRequirements.driverLicenses,
              travellingReady: fullJobData.vacancy.candidateRequirements.travellingReady,
              specialization: {
                specialization: fullJobData.vacancy.candidateRequirements.specialization,
                isComparableSpecialization: fullJobData.vacancy.candidateRequirements.isComparableSpecialization
              },
              typeOfDegree: {
                typeOfDegree: fullJobData.vacancy.candidateRequirements.typeOfDegree,
                isComparableDegreeType: fullJobData.vacancy.candidateRequirements.isComparableDegreeType
              },
              workExperience: {
                isWorkExperienceRequired: fullJobData.vacancy.candidateRequirements.isWorkExperienceRequired,
                workExperienceInYears: fullJobData.vacancy.candidateRequirements.workExperienceInYears
              },
              timeLimit: {
                isTimeLimited: fullJobData.vacancy.details.isTimeLimited,
                timeLimitUntil: fullJobData.vacancy.details.timeLimitUntil,
                timeLimitInMonths: fullJobData.vacancy.details.timeLimitInMonths
              }
            };
          }
          return fullJobData;
        })
      )
      .subscribe(
        data => {
          console.log('VACANCY DATA', data);
          this.vacancyData = data;
        },
        err => {
          console.log('VACANCY DATA ERROR', err);
          this.globalErrorService.handleError(err);
        }
      );
  }

  public applyVacancy = () => {
    const jobApply$ = this.applicationService.jobApply(this.jobId);
    jobApply$
      .pipe()
      .subscribe(
        res => {
          this.applicationService.removeJobId();
          this.router.navigate([`/apply-thanks/${this.jobId}/keep/true`]);
        },
        err => {
          console.log('[ ERROR APPLY JOB ]', err);
          this.applicationService.removeJobId();
          this.globalErrorService.handleError(err);
        },
        () => console.log('[ DONE APPLY JOB ]')
      );
  }

  public openPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

  public goToHome = () => {
    this.router.navigate(['/home']);
  }

  public downloadCvFile = () => {
    this.downloadFileService.downloadCandidateCv();
  }

}
