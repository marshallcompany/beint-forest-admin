import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { SearchService } from '../../../services/search.service';
import { FormGroup, FormArray, FormBuilder, FormGroupName, FormControl } from '@angular/forms';
import { FormValidators } from '../../../validators/validators';
import { map, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

import * as moment from 'moment';
import { throwError, of, forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { fadeAnimation } from 'src/app/animations/router-animations';
import { DateService } from 'src/app/services/date.service';


@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss'],
  animations: [fadeAnimation]
})

export class SearchSettingsComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-04.svg',
    imgDesktop: '../assets/image/profile/search/image-desktop.svg',
    imgMobile: '../assets/image/profile/search/image-mobile.svg',
    nameCategory: 'Such-Präferenzen',
    nextCategory: 'profile/document',
    prevCategory: 'profile/professional-background',
    loading: true
  };

  public viewPortStatus = true;
  public businessOptions$: Observable<any>;
  public industryOptions$: Observable<any>;
  public benefitsOptions$: Observable<any>;
  public placeOptions$: Observable<any>;

  public minDate = moment().toISOString();

  public form: FormGroup;
  public salaryExpectations: FormGroupName;
  public businessBranchesControl = new FormControl();
  public industryBranchesControl = new FormControl();
  public employmentTypesControl = new FormControl();
  public workingHoursControl = new FormControl();
  public benefitsControl = new FormControl();
  public placeControl = new FormControl();
  public formData: object;
  public dropdownOptions: any;

  constructor(
    public searchService: SearchService,
    public profileService: ProfileService,
    public router: Router,
    public dateService: DateService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.init();
    this.placeOptions$ = this.searchService.getTowns('de', '', 'Deutschland');
    this.industryOptions$ = this.searchService.getIndustryBranches('de', '');
    this.benefitsOptions$ = this.searchService.getBenefits('de', '');
    this.businessOptions$ = this.searchService.getBusinessBranches('de', '');
  }

  public initForm = () => {
    this.form = this.fb.group({
      searchPreferences: this.fb.group({
        salaryExpectations: this.fb.group({
          // min: ['', [FormValidators.numberValidation]],
          // max: ['', [FormValidators.numberValidation]],
          salary: ['', [FormValidators.numberValidation]]
        }),
        willingToRelocate: [false],
        allDesiredPlaces: [false],
        readyToStartJobFrom: [''],
        readyToStartJobFromString: [''],
        travellingReady: [null],
        timeLimit: [null],
        fromNow: [false],
        desiredPlacesOfWork: this.fb.array([]),
        desiredEmploymentTypes: this.fb.array([]),
        preferredBusinessAreas: this.fb.array([]),
        preferredWorkingHours: this.fb.array([]),
        desiredIndustryBranches: this.fb.array([]),
        benefits: this.fb.array([]),
      })
    });
    if (this.form && this.form.get('searchPreferences')) {
      this.form.get('searchPreferences').valueChanges
        .pipe()
        .subscribe(
          () => {
            this.businessBranchesControl.patchValue(this.preferredBusinessArray.value.length !== 0 ? this.preferredBusinessArray.value : ['']);
            this.industryBranchesControl.patchValue(this.industryBranchesArray.value.length !== 0 ? this.industryBranchesArray.value : ['']);
            this.employmentTypesControl.patchValue(this.employmentTypesArray.value.length !== 0 ? this.employmentTypesArray.value : ['']);
            this.workingHoursControl.patchValue(this.preferredWorkingHoursArray.value.length !== 0 ? this.preferredWorkingHoursArray.value : ['']);
            this.benefitsControl.patchValue(this.benefitsArray.value.length !== 0 ? this.benefitsArray.value : ['']);
            this.placeControl.patchValue(this.desiredPlacesOfWorkArray.value.length !== 0 ? this.desiredPlacesOfWorkArray.value : ['']);
          }
        );
    }
  }

  public checkViewPort = () => {
    if (window.innerWidth <= 768) {
      this.viewPortStatus = false;
    }
    return;
  }

  public get desiredPlacesOfWorkArray(): FormArray {
    return this.form.get('searchPreferences').get('desiredPlacesOfWork') as FormArray;
  }
  public get industryBranchesArray(): FormArray {
    return this.form.get('searchPreferences').get('desiredIndustryBranches') as FormArray;
  }
  public get preferredBusinessArray(): FormArray {
    return this.form.get('searchPreferences').get('preferredBusinessAreas') as FormArray;
  }
  public get employmentTypesArray(): FormArray {
    return this.form.get('searchPreferences').get('desiredEmploymentTypes') as FormArray;
  }
  public get preferredWorkingHoursArray(): FormArray {
    return this.form.get('searchPreferences').get('preferredWorkingHours') as FormArray;
  }
  public get benefitsArray(): FormArray {
    return this.form.get('searchPreferences').get('benefits') as FormArray;
  }

  public formArrayPush = (value, formArrayName, field) => {
    if (value && formArrayName && field) {
      this[formArrayName].push(this.fb.control(value.slice(-1)[0]));
      this.submit(field);
    } else {
      return false;
    }
  }

  public formArrayRemove = (index, formArrayName, field) => {
    if (index && formArrayName && field) {
      this[formArrayName].removeAt(index);
      this.submit(field);
    } else if (index === 0) {
      this[formArrayName].removeAt();
      this.submit(field);
    }
  }

  public init = () => {
    const profile$ = this.profileService.getProfile();
    const dropdownOptions$ = this.profileService.getLocalBundle('de');
    this.checkViewPort();
    forkJoin([profile$, dropdownOptions$])
      .pipe(
        map(([profile, dropdownOptions]) => {
          if (profile && profile.profile && profile.profile.searchPreferences && dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              searchPreferences: profile.profile.searchPreferences,
              dropdownOptions: {
                employment_type: dropdownOptions.dropdownOptions.employment_type,
                working_hours: dropdownOptions.dropdownOptions.working_hours,
                travelling: dropdownOptions.dropdownOptions.travelling,
                timeLimit: dropdownOptions.dropdownOptions.timeLimit
              }
            };
          }
          return [profile, dropdownOptions];
        })
      )
      .subscribe((res: any) => {
        this.dropdownOptions = res.dropdownOptions;
        this.patchFormValue(res.searchPreferences);
        this.navSettings.loading = false;
        console.log('res', res);
      });
  }

  public swipe = ($event) => {
    // SWIPE RIGHT
    if ($event.deltaX > 100 && window.innerWidth <= 768) {
      this.router.navigate([this.navSettings.prevCategory]);
    }
    // SWIPE LEFT
    if ($event.deltaX < 0 && window.innerWidth <= 768) {
      this.router.navigate([this.navSettings.nextCategory]);
    }
  }

  public dateSave = (message: string, formGroup: FormGroup, formControl: string) => {
    const formControlDateString = formControl + 'String';
    const valueDateString = formGroup.get(formControlDateString).value;
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexFullDateNumber)) {
      formGroup.get(formControl).setValue(this.dateService.createDayMonthYearDate(valueDateString));
      this.submit(message);
    }
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexFullDateEmpty)) {
      formGroup.get(formControl).setValue('');
      this.submit(message);
    }
  }

  public patchFormValue = (searchPreferences) => {
    this.form.get('searchPreferences').patchValue({
      salaryExpectations: {
        // min: searchPreferences.salaryExpectations.min,
        // max: searchPreferences.salaryExpectations.max,
        salary: searchPreferences.salaryExpectations.salary,
      },
      travellingReady: searchPreferences.travellingReady ? searchPreferences.travellingReady : null,
      timeLimit: searchPreferences.timeLimit ? searchPreferences.timeLimit : null,
      fromNow: searchPreferences.fromNow ? searchPreferences.fromNow : false,
      readyToStartJobFrom: searchPreferences.readyToStartJobFrom,
      readyToStartJobFromString: searchPreferences.readyToStartJobFrom ? this.dateService.updateFormControlDate(searchPreferences.readyToStartJobFrom, 'd.m.y') : '',
      willingToRelocate: searchPreferences.willingToRelocate
    });
    searchPreferences.desiredPlacesOfWork.forEach(element => {
      this.desiredPlacesOfWorkArray.push(this.fb.control(element));
    });
    searchPreferences.desiredIndustryBranches.forEach(element => {
      this.industryBranchesArray.push(this.fb.control(element));
    });
    searchPreferences.preferredBusinessAreas.forEach(element => {
      this.preferredBusinessArray.push(this.fb.control(element));
    });
    searchPreferences.desiredEmploymentTypes.forEach(element => {
      this.employmentTypesArray.push(this.fb.control(element));
    });
    searchPreferences.preferredWorkingHours.forEach(element => {
      this.preferredWorkingHoursArray.push(this.fb.control(element));
    });
    searchPreferences.benefits.forEach(element => {
      this.benefitsArray.push(this.fb.control(element));
    });
  }

  public fromNow = (formControl: FormControl) => {
    if (formControl.value) {
      this.form.get('searchPreferences').get('readyToStartJobFrom').setValue('');
      this.form.get('searchPreferences').get('readyToStartJobFromString').setValue('');
    }
    this.submit('ab sofort');
  }

  public submit = (field) => {
    console.log('submit', this.form.value);
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (this.form.invalid) {
            return throwError('[ FORM INVALID ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ PROFILE UPDATE ]', res);
          this.formData = this.form.value;
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }

}
