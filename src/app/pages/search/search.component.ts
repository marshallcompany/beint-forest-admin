import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from 'src/app/services/application-service';
import { map, switchMap } from 'rxjs/operators';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { of, Observable, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChild('scrollToTop', { static: false }) scrollToTop;

  public listJobVacancy: Array<any>;
  public listCheckboxPrivacy: Array<any>;

  public spinner: boolean;
  public noJobVacancy: boolean;
  public selectedIndex = 0;

  public vacancyData: object;
  public profileData: object;

  public resendEmailStatus = false;
  public loadingStatus = false;

  constructor(
    public matDialog: MatDialog,
    public globalErrorService: GlobalErrorService,
    public router: Router,
    public applicationService: ApplicationService,
    private profileService: ProfileService,
    private auth: AuthService
  ) {
    this.listJobVacancy = [];
    this.listCheckboxPrivacy = [];
    this.spinner = true;
  }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.applicationService.getAllJob()
      .pipe(
        switchMap(allJobVacancy => {
          const arr: Array<Observable<any>> = [
            this.profileService.getProfile(),
            of(allJobVacancy)
          ];
          return forkJoin(arr);
        }),
        map(([profileData, allJobVacancy]) => {
          if (allJobVacancy && allJobVacancy.data) {
            allJobVacancy.data.forEach(vacancy => {
              this.listJobVacancy.push(
                {
                  vacancyId: vacancy._id,
                  vacancyUrl: vacancy.details.vacancyExternalUrl,
                  companyName: vacancy.company.profile.general.companyName,
                  place: vacancy.company.profile.contact.place,
                  companyLogo: vacancy.company && vacancy.company.media && vacancy.company.media.logo &&
                    vacancy.company.media.logo.storagePath
                    ? vacancy.company.media.logo.storagePath : '',
                  activationDate: vacancy.details.activationDate,
                  industryBranch: vacancy.details.industryBranch,
                  businessArea: vacancy.details.businessArea,
                  employmentType: vacancy.details.employmentType,
                  workingHours: vacancy.details.workingHours,
                  jobTitle: vacancy.details.title,
                  occupyAt: vacancy.details.occupyAt,
                  topSkills: vacancy.candidateRequirements.primarySkills,
                  skills: vacancy.candidateRequirements.secondarySkills,
                  languages: vacancy.candidateRequirements.linguisticProficiency,
                  careerLevel: vacancy.candidateRequirements.careerLevel,
                  driverLicenses: vacancy.candidateRequirements.driverLicenses,
                  travellingReady: vacancy.candidateRequirements.travellingReady,
                  specialization: {
                    specialization: vacancy.candidateRequirements.specialization,
                    isComparableSpecialization: vacancy.candidateRequirements.isComparableSpecialization
                  },
                  typeOfDegree: {
                    typeOfDegree: vacancy.candidateRequirements.typeOfDegree,
                    isComparableDegreeType: vacancy.candidateRequirements.isComparableDegreeType
                  },
                  workExperience: {
                    isWorkExperienceRequired: vacancy.candidateRequirements.isWorkExperienceRequired,
                    workExperienceInYears: vacancy.candidateRequirements.workExperienceInYears
                  },
                  timeLimit: {
                    isTimeLimited: vacancy.details.isTimeLimited,
                    timeLimitUntil: vacancy.details.timeLimitUntil,
                    timeLimitInMonths: vacancy.details.timeLimitInMonths
                  }
                }
              );
            });
            return [profileData, this.listJobVacancy];
          }
          return [profileData, allJobVacancy];
        }),
      )
      .subscribe(
        ([profileData, allJobVacancy]) => {
          console.log('[ ALL JOB VACANCY ]', [profileData, allJobVacancy]);
          this.spinner = false;
          if (this.listJobVacancy && this.listJobVacancy.length) {
            this.profileData = profileData;
            this.vacancyData = this.listJobVacancy[0];
            this.noJobVacancy = false;
            this.listJobVacancy.forEach(vacancy => {
              this.listCheckboxPrivacy.push(
                { status: false }
              );
            });
          } else {
            this.noJobVacancy = true;
          }
        },
        error => {
          console.log('[ GET ALL JOB VACANCY ERROR ]', error);
          this.spinner = false;
        }
      );
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

  public selectedVacancy = (index) => {
    this.selectedIndex = index;
    this.vacancyData = this.listJobVacancy[index];
    this.scrollToTop.nativeElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  public openGroup = (e) => {
    e.classList.add('acord-active');
  }

  public closeGroup = (e) => {
    e.classList.remove('acord-active');
  }

  public openPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

}
