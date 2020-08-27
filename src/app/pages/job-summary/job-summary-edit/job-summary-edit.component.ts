import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { of, throwError, Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { OptionsService } from 'src/app/services/options.service';
import { CompanyService } from 'src/app/services/company.service';
import { DateService } from 'src/app/services/date.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JobSummaryService } from 'src/app/services/job-summary.service';



interface DropdownOption {
  industry_branches: Array<string[]>;
  employment_type: Array<string[]>;
  working_hours: Array<string[]>;
  timeLimit: Array<string[]>;
  travelling: Array<string[]>;
  driving_license_category: Array<string[]>;
  language_level: Array<string[]>;
  typeOfDegree: Array<string[]>;
  courseOfStudy: Array<string[]>;
}

@Component({
  selector: 'app-job-summary-edit',
  templateUrl: './job-summary-edit.component.html',
  styleUrls: ['./job-summary-edit.component.scss']
})
export class JobSummaryEditComponent implements OnInit {

  public benefitsList$: Observable<any>;
  public businessArea$: Observable<any>;
  public apprenticeshipList$: Observable<any>;
  public skillsList$: Observable<any>;
  public langList$: Observable<any>;
  public specializationList$: Observable<any>;
  public jobSummaryAddressList$: Observable<any>;

  public dropdownOptions: DropdownOption;

  public form: FormGroup;
  public generalFormGroup: FormGroup;
  public industryBranchControl = new FormControl();
  public businessAreaControl = new FormControl();
  public courseOfStudyControl = new FormControl();
  public specializationControl = new FormControl();
  public professionalEducationControl = new FormControl();
  public driverLicensesControl = new FormControl();
  public primarySkillsControl = new FormControl();
  public secondarySkillsControl = new FormControl();
  public benefitsControl = new FormControl();

  public recruiters;
  public companyID;
  public jobSummaryID;

  constructor(
    public fb: FormBuilder,
    public companyService: CompanyService,
    public jobSummaryService: JobSummaryService,
    public dateService: DateService,
    private notificationService: NotificationService,
    private router: Router,
    private optionsService: OptionsService,
    private route: ActivatedRoute,
  ) {
    // this.companyID = this.route.snapshot.paramMap.get('companyID');
    this.jobSummaryID = this.route.snapshot.paramMap.get('jobSummaryId');
  }

  ngOnInit() {
    this.init();
    this.formInit();
  }

  public init = () => {
    const dropdownOptions$ = this.optionsService.getLocalBundle('de');
    const getJobSummary$ = this.jobSummaryService.getJobSummary(this.jobSummaryID);
    this.businessArea$ = this.optionsService.getBusinessBranches('de', '');
    this.benefitsList$ = this.optionsService.getBenefitsOptions('de', '');
    this.apprenticeshipList$ = this.optionsService.getProfessionalEducation('de', '');
    this.skillsList$ = this.optionsService.getSkills('de');
    this.langList$ = this.optionsService.getLang('de', '');
    this.specializationList$ = this.optionsService.getSpecializationUniversity('de', '');
    forkJoin([getJobSummary$, dropdownOptions$])
      .pipe(
        map(([jobSummary, dropdownOptions]) => {
          if (jobSummary && dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              dropdownOptions: {
                industry_branches: dropdownOptions.dropdownOptions.industry_branches,
                employment_type: dropdownOptions.dropdownOptions.employment_type,
                working_hours: dropdownOptions.dropdownOptions.working_hours,
                timeLimit: dropdownOptions.dropdownOptions.timeLimit,
                travelling: dropdownOptions.dropdownOptions.travelling,
                driving_license_category: dropdownOptions.dropdownOptions.driving_license_category,
                language_level: dropdownOptions.dropdownOptions.language_level,
                typeOfDegree: dropdownOptions.dropdownOptions.typeOfDegree,
                courseOfStudy: dropdownOptions.dropdownOptions.courseOfStudy,
              },
              company: {
                companyId: jobSummary.company._id,
                companyName: jobSummary.company.profile.general.companyName,
                logo: jobSummary.company.media.logo.storagePath
              },
              details: jobSummary.details,
              candidateRequirements: jobSummary.candidateRequirements,
              recruiter: {
                id: jobSummary.responsible_recruiter.id
              }
            };
          }
          return [jobSummary, dropdownOptions];
        })
      )
      .subscribe(
        (result: any) => {
          this.dropdownOptions = result.dropdownOptions;
          this.companyID = result.company.companyId;
          this.jobSummaryAddressList$ = this.optionsService.getJobSummaryAddres(this.companyID);
          this.patchFormValue(result);
          this.getCompanyData(result.recruiter.id);
          console.log('[ INIT ]', result);
        },
        error => {
          console.log('[ INIT ERROR ]', error);
        }
      );
  }

  public formInit = () => {
    this.form = this.fb.group({
      details: this.fb.group({
        title: ['', [Validators.required]],
        vacancyExternalUrl: ['', [Validators.required]],
        location: [''],
        occupyAt: [''],
        occupyAtString: [''],
        fromNow: [false],
        industryBranch: this.fb.array([]),
        businessArea: this.fb.array([]),
        employmentType: [null],
        workingHours: [null],
        limitDayHours: [''],
        isTimeLimited: [null],
        timeLimitUntil: [''],
        timeLimitUntilString: [''],
        timeLimitInMonths: [''],
        benefits: this.fb.array([])
      }),
      candidateRequirements: this.fb.group({
        workExperienceInYears: [''],
        isLeadershipExperienceNecessary: [null],
        leadershipExperienceYears: [''],
        typeOfDegree: [null],
        courseOfStudy: this.fb.array([]),
        orSimilarCourse: [false],
        specialization: this.fb.array([]),
        professionalEducation: this.fb.array([]),
        orSimilarEducation: [false],
        travellingReady: [null],
        driverLicenses: this.fb.array([]),
        primarySkills: this.fb.array([]),
        secondarySkills: this.fb.array([]),
        linguisticProficiency: this.fb.array([])
      }),
      company: this.fb.group({
        companyName: [''],
        logo: [''],
        recruiter: [null, [Validators.required]],
        recruiterPhone: [''],
        recruiterEmail: ['']
      })
    });
    if (this.form) {
      this.linguisticProficiencyArray.push(this.createFormGroup({}, 'linguistic'));
      this.form.valueChanges
        .pipe()
        .subscribe(
          () => {
            this.industryBranchControl.patchValue(this.industryBranchArray.value.length !== 0 ? this.industryBranchArray.value : ['']);
            this.businessAreaControl.patchValue(this.businessAreaArray.value.length !== 0 ? this.businessAreaArray.value : ['']);
            this.courseOfStudyControl.patchValue(this.courseOfStudyArray.value.length !== 0 ? this.courseOfStudyArray.value : ['']);
            this.specializationControl.patchValue(this.specializationArray.value.length !== 0 ? this.specializationArray.value : ['']);
            this.driverLicensesControl.patchValue(this.driverLicensesArray.value.length !== 0 ? this.driverLicensesArray.value : ['']);
            this.primarySkillsControl.patchValue(this.primarySkillsArray.value.length !== 0 ? this.primarySkillsArray.value : ['']);
            this.secondarySkillsControl.patchValue(this.secondarySkillsArray.value.length !== 0 ? this.secondarySkillsArray.value : ['']);
            this.benefitsControl.patchValue(this.benefitsArray.value.length !== 0 ? this.benefitsArray.value : ['']);

          }
        );
    }
  }

  public patchFormValue = (data) => {
    this.form.patchValue({
      details: {
        title: data && data.details && data.details.title ? data.details.title : '',
        vacancyExternalUrl: data && data.details && data.details.vacancyExternalUrl ? data.details.vacancyExternalUrl : '',
        location: data && data.details && data.details.location ? data.details.location : null,
        occupyAt: data && data.details && data.details.occupyAt ? data.details.occupyAt : '',
        occupyAtString: data && data.details && data.details.occupyAt ? this.dateService.updateFormControlDate(data.details.occupyAt, 'd.m.y') : '',
        fromNow: data && data.details && data.details.fromNow ? data.details.fromNow : false,
        employmentType: data && data.details && data.details.employmentType ? data.details.employmentType : null,
        workingHours: data && data.details && data.details.workingHours ? data.details.workingHours : null,
        limitDayHours: data && data.details && data.details.limitDayHours ? data.details.limitDayHours : '',
        isTimeLimited: data && data.details && data.details.isTimeLimited ? data.details.isTimeLimited : false,
        timeLimitUntil: data && data.details && data.details.timeLimitUntil ? data.details.timeLimitUntil : '',
        timeLimitUntilString: data && data.details && data.details.timeLimitUntil ? this.dateService.updateFormControlDate(data.details.timeLimitUntil, 'd.m.y') : '',
        timeLimitInMonths: data && data.details && data.details.timeLimitInMonths ? data.details.timeLimitInMonths : '',
      },
      candidateRequirements: {
        workExperienceInYears: data && data.candidateRequirements && data.candidateRequirements.workExperienceInYears ? data.candidateRequirements.workExperienceInYears : '',
        isLeadershipExperienceNecessary: data && data.candidateRequirements && data.candidateRequirements.isLeadershipExperienceNecessary ? data.candidateRequirements.isLeadershipExperienceNecessary : null,
        leadershipExperienceYears: data && data.candidateRequirements && data.candidateRequirements.leadershipExperienceYears ? data.candidateRequirements.leadershipExperienceYears : '',
        typeOfDegree: data && data.candidateRequirements && data.candidateRequirements.typeOfDegree ? data.candidateRequirements.typeOfDegree : null,
        orSimilarCourse: data && data.candidateRequirements && data.candidateRequirements.orSimilarCourse ? data.candidateRequirements.orSimilarCourse : false,
        orSimilarEducation: data && data.candidateRequirements && data.candidateRequirements.orSimilarEducation ? data.candidateRequirements.orSimilarEducation : false,
        travellingReady: data && data.candidateRequirements && data.candidateRequirements.travellingReady ? data.candidateRequirements.travellingReady : null
      },
      company: {
        recruiter: data && data.recruiter && data.recruiter.id ? data.recruiter.id : null
      }
    });
    if (data && data.details && data.details.industryBranch) {
      data.details.industryBranch.forEach(element => {
        this.industryBranchArray.push(this.fb.control(element));
      });
    }
    if (data && data.details && data.details.businessArea) {
      data.details.businessArea.forEach(element => {
        this.businessAreaArray.push(this.fb.control(element));
      });
    }
    if (data && data.details && data.details.benefits) {
      data.details.benefits.forEach(element => {
        this.benefitsArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.courseOfStudy) {
      data.candidateRequirements.courseOfStudy.forEach(element => {
        this.courseOfStudyArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.specialization) {
      data.candidateRequirements.specialization.forEach(element => {
        this.specializationArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.professionalEducation) {
      data.candidateRequirements.professionalEducation.forEach(element => {
        this.professionalEducationArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.driverLicenses) {
      data.candidateRequirements.driverLicenses.forEach(element => {
        this.driverLicensesArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.primarySkills) {
      data.candidateRequirements.primarySkills.forEach(element => {
        this.primarySkillsArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.secondarySkills) {
      data.candidateRequirements.secondarySkills.forEach(element => {
        this.secondarySkillsArray.push(this.fb.control(element));
      });
    }
    if (data && data.candidateRequirements && data.candidateRequirements.linguisticProficiency.length) {
      this.linguisticProficiencyArray.removeAt(0);
      data.candidateRequirements.linguisticProficiency.forEach(element => {
        this.linguisticProficiencyArray.push(this.createFormGroup(element, 'linguistic'));
      });
    }
  }

  public changeRecruiter = (value) => {
    this.recruiters.filter(item => {
      if (item._id === value) {
        this.form.get('company').patchValue({
          recruiterPhone: item.phoneNumberMobile ? item.phoneNumberMobile : '',
          recruiterEmail: item.email ? item.email : ''
        });
      }
    });
  }

  public getCompanyData = (idRecruiter?: string) => {
    this.companyService.getCompany(this.companyID)
      .pipe(
        map((companyData) => {
          if (companyData && companyData.company.companyName && companyData.company.logo && companyData.company.logo.storagePath && companyData.recruiters) {
            return {
              companyName: companyData.company.companyName ? companyData.company.companyName : '',
              logo: companyData.company.logo.storagePath ? companyData.company.logo.storagePath : '',
              recruiters: companyData.recruiters ? companyData.recruiters : []
            };
          }
        })
      )
      .subscribe(result => {
        this.recruiters = result.recruiters;
        this.form.get('company').patchValue({
          companyName: result.companyName ? result.companyName : '',
          logo: result.logo ? result.logo : ''
        });
        this.changeRecruiter(idRecruiter);
      });
  }

  public get industryBranchArray(): FormArray {
    return this.form.get('details').get('industryBranch') as FormArray;
  }

  public get businessAreaArray(): FormArray {
    return this.form.get('details').get('businessArea') as FormArray;
  }

  public get courseOfStudyArray(): FormArray {
    return this.form.get('candidateRequirements').get('courseOfStudy') as FormArray;
  }

  public get specializationArray(): FormArray {
    return this.form.get('candidateRequirements').get('specialization') as FormArray;
  }

  public get professionalEducationArray(): FormArray {
    return this.form.get('candidateRequirements').get('professionalEducation') as FormArray;
  }

  public get driverLicensesArray(): FormArray {
    return this.form.get('candidateRequirements').get('driverLicenses') as FormArray;
  }

  public get primarySkillsArray(): FormArray {
    return this.form.get('candidateRequirements').get('primarySkills') as FormArray;
  }

  public get secondarySkillsArray(): FormArray {
    return this.form.get('candidateRequirements').get('secondarySkills') as FormArray;
  }

  public get linguisticProficiencyArray(): FormArray {
    return this.form.get('candidateRequirements').get('linguisticProficiency') as FormArray;
  }

  public get benefitsArray(): FormArray {
    return this.form.get('details').get('benefits') as FormArray;
  }

  public newFormGroup = (formArrayName: FormArray, formGroupName: string) => {
    formArrayName.push(this.createFormGroup({}, formGroupName));
  }

  public deleteFormGroup = (formArray: FormArray, index: number, formGroupName: string) => {
    if (formArray.controls.length < 2) {
      formArray.removeAt(index);
      formArray.push(this.createFormGroup({}, formGroupName));
    } else {
      formArray.removeAt(index);
    }
  }

  public createFormGroup = (data, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'linguistic':
        return this.fb.group({
          language: [data && data.language ? data.language : null],
          skillLevel: [data && data.skillLevel ? data.skillLevel : null],
        });
      default:
        break;
    }
  }

  public dateSave = (formGroup: FormGroup, formControl: string) => {
    const formControlDateString = formControl + 'String';
    const valueDateString = formGroup.get(formControlDateString).value;
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexFullDateNumber)) {
      formGroup.get(formControl).setValue(this.dateService.createDayMonthYearDate(valueDateString));
    }
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexFullDateEmpty)) {
      formGroup.get(formControl).setValue('');
    }
  }

  public fromNow = (formControl: FormControl) => {
    if (formControl.value) {
      this.form.get('details').get('occupyAt').setValue('');
      this.form.get('details').get('occupyAtString').setValue('');
    }
  }

  public formArrayPush = (value, formArrayName) => {
    if (value && formArrayName) {
      this[formArrayName].push(this.fb.control(value.slice(-1)[0]));
    } else {
      return false;
    }
  }

  public formArrayRemove = (index, formArrayName) => {
    if (index && formArrayName) {
      this[formArrayName].removeAt(index);
    } else if (index === 0) {
      this[formArrayName].removeAt();
    }
  }

  public onlyNumber = (event: any, addition?: boolean) => {
    const pattern = /[0-9]/;
    const patternPlus = /[0-9\+]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!addition && event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (addition && event.keyCode !== 8 && !patternPlus.test(inputChar)) {
      event.preventDefault();
    }
  }
  public submit = () => {
    const formValue = {
      details: this.form.get('details').value,
      candidateRequirements: this.form.get('candidateRequirements').value,
      company: this.companyID,
      responsible_recruiter: this.form.get('company').get('recruiter').value
    };
    this.jobSummaryService.updateJobSummary(formValue, this.jobSummaryID)
      .pipe()
      .subscribe(
        result => {
          console.log('[ UPDATE JOB SUMMARY DONE]', result);
          this.notificationService.notify('Änderungen erfolgreich gespeichert', 'success');
        },
        error => {
          console.log('[ UPDATE JOB SUMMARY ERROR]', error);
        }
      );
    console.log('SUBMIT', formValue);
  }
}
