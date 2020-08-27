import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { of, throwError, Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { OptionsService } from 'src/app/services/options.service';
import { FormValidators } from 'src/app/validators/validators';
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
  selector: 'app-job-summary-create',
  templateUrl: './job-summary-create.component.html',
  styleUrls: ['./job-summary-create.component.scss']
})
export class JobSummaryCreateComponent implements OnInit {

  public benefitsList$: Observable<any>;
  public businessArea$: Observable<any>;
  public apprenticeshipList$: Observable<any>;
  public skillsList$: Observable<any>;
  public langList$: Observable<any>;
  public specializationList$: Observable<any>;

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
    this.companyID = this.route.snapshot.paramMap.get('companyID');
  }

  ngOnInit() {
    this.init();
    this.formInit();
    this.getCompanyData();
  }

  public init = () => {
    const dropdownOptions$ = this.optionsService.getLocalBundle('de');
    this.businessArea$ = this.optionsService.getBusinessBranches('de', '');
    this.benefitsList$ = this.optionsService.getBenefitsOptions('de', '');
    this.apprenticeshipList$ = this.optionsService.getProfessionalEducation('de', '');
    this.skillsList$ = this.optionsService.getSkills('de');
    this.langList$ = this.optionsService.getLang('de', '');
    this.specializationList$ = this.optionsService.getSpecializationUniversity('de', '');
    forkJoin([dropdownOptions$])
    .pipe(
      map(([dropdownOptions]) => {
        if (dropdownOptions && dropdownOptions.dropdownOptions) {
          console.log('XXXXXX', dropdownOptions.dropdownOptions);
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
            }
          };
        }
      })
    )
    .subscribe(
      (result: any) => {
        console.log('[ INIT ]', result);
        this.dropdownOptions = result.dropdownOptions;
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

  public getCompanyData = () => {
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
    .subscribe( result => {
      this.recruiters = result.recruiters;
      this.form.get('company').patchValue({
        companyName: result.companyName ? result.companyName : '',
        logo: result.logo ? result.logo : ''
      });
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
  public googleAddressChange = (data, formGroup: FormGroup, fields: Array<string>) => {
    of(data)
      .pipe(
        switchMap(value => {
          if (value === '[NO VALUE]') {
            this.cleaningFormControl(formGroup, fields);
            return throwError('[NO VALUE]');
          }
          return of(value);
        }),
        switchMap(googleAddress => {
          return of(
            {
              location: googleAddress.value
            }
          );
        })
      )
      .subscribe(
        result => {
          console.log('RESULT', result);
          this.updateFormControl(formGroup, fields, result);
        },
        error => {
          console.log('[ GOOGLE ADDRESS ERROR ]', error);
        }
      );
  }

  public cleaningFormControl = (formGroup: FormGroup, fields: Array<string>) => {
    fields.forEach(item => {
      formGroup.get(item).setValue('');
    });
  }

  public updateFormControl = (formGroup: FormGroup, fields: Array<string>, value) => {
    fields.forEach(item => {
      formGroup.get(item).setValue(value[item]);
    });
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
      this.form.get('occupyAt').setValue('');
      this.form.get('occupyAtString').setValue('');
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

    if (!addition &&  event.keyCode !== 8 && !pattern.test(inputChar)) {
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
    this.jobSummaryService.createJobSummary(formValue)
    .pipe()
    .subscribe(
      result => {
        console.log('[ CREATE JOB SUMMARY DONE]', result);
        this.router.navigate(['job-summary/successful']);
      },
      error => {
        console.log('[ CREATE JOB SUMMARY ERROR]', error);
      }
    );
    console.log('SUBMIT', formValue);
  }
}
