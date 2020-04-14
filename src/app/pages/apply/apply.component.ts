import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DownloadFileService } from 'src/app/services/download-file.service';
import { ProfileService } from 'src/app/services/profile.service';
import { map } from 'rxjs/operators';
import { ApplicationService } from 'src/app/services/application-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PrivacyPolicyComponent } from 'src/app/components/modal/privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

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
  ) {
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.getJobData();
  }

  dataRefresh = () => {
    this.getUserProfile();
  }

  public getUserProfile = () => {
    if (this.authService.getAuthData()) {
      this.profileService.getProfile()
        .pipe(
          map((fullUserProfile: any) => {
            if (fullUserProfile) {
              return {
                firstName: fullUserProfile.profile.personal.firstName,
                avatar: fullUserProfile.media.avatar.storagePath
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

  // http://localhost:4200/apply/5e95ba609f63ad003d37d1ae/keep/true

  public getJobData = () => {
    this.jobId = this.route.snapshot.paramMap.get('jobId');
    this.applicationService.getJobData(this.jobId)
      .pipe(
        map((fullJobData: any) => {
          if (fullJobData && fullJobData.vacancy) {
            return {
              companyName: fullJobData.vacancy.company.profile.general.companyName,
              place: fullJobData.vacancy.company.profile.contact.place,
              companyLogo: fullJobData.vacancy.company.media.logo.storagePath,
              activationDate: fullJobData.vacancy.details.activationDate,
              industryBranch: fullJobData.vacancy.details.industryBranch,
              businessAreas: fullJobData.vacancy.details.businessAreas,
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
          console.log('DATA JOB', data);
          this.vacancyData = data;
        },
        err => {
          console.log('error', err);
        },
        () => console.log('[ DATA JOB DONE ]')
      );
  }

  public applyVacancy = () => {
    this.router.navigate([`/apply-thanks/${this.jobId}/keep/true`]);
  }

  public openPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

  public downloadCvFile = () => {
    this.downloadFileService.downloadCandidateCv();
  }

}
