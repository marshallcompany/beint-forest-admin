import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/services/application-service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public listJobVacancy: Array<any>;
  public selectedIndex = 0;
  public vacancyData: object;

  constructor(
    public applicationService: ApplicationService
  ) {
    this.listJobVacancy = [];
  }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.applicationService.getAllJob()
      .pipe(
        map(allJobVacancy => {
          if (allJobVacancy && allJobVacancy.data) {
            allJobVacancy.data.forEach(vacancy => {
              this.listJobVacancy.push(
                {
                  vacancyId: vacancy._id,
                  vacancyInternalUrl: vacancy.__vacancyInternalUrl,
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
            return [this.listJobVacancy, allJobVacancy];
          }
          return allJobVacancy;
        })
      )
      .subscribe(
        res => {
          console.log('[ ALL JOB VACANCY ]', res);
          if (this.listJobVacancy && this.listJobVacancy.length) {
            this.vacancyData = this.listJobVacancy[0];
          }
        }
      );
  }

  public selectedVacancy = (index) => {
    this.selectedIndex = index;
    this.vacancyData = this.listJobVacancy[index];
    console.log('data', this.vacancyData);
  }
}
