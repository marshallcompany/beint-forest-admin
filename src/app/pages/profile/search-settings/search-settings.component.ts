import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { SearchService } from '../../../services/search.service';
import { FormGroup, FormArray, FormBuilder, FormGroupName, FormControl } from '@angular/forms';
import { FormValidators } from '../../../validators/validators';
import { map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

import * as moment from 'moment';
import { throwError, of, forkJoin, fromEvent, Observable } from 'rxjs';


@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})

export class SearchSettingsComponent implements OnInit, AfterViewInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-04.svg',
    imgDesktop: '../assets/image/profile/search/image-desktop.svg',
    imgMobile: '../assets/image/profile/search/image-mobile.svg',
    nameCategory: 'Such-Präferenzen',
    nextCategory: 'profile/document',
    prevCategory: 'profile/professional-background'
  };

  @ViewChild('searchBusiness', { static: false }) searchBusiness;
  public businessOptions$: Observable<any>;

  @ViewChild('searchIndustry', { static: false }) searchIndustry;
  public industryOptions$: Observable<any>;

  @ViewChild('searchBenefits', { static: false }) searchBenefits;
  public benefitsOptions$: Observable<any>;

  @ViewChild('searchPlace', { static: false }) searchPlace;
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
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.init();
  }

  ngAfterViewInit() {
    this.searchBenefits.searchInput.nativeElement.placeholder = 'Geben Sie die gewünschte ein';
    this.searchPlace.searchInput.nativeElement.placeholder = 'Wunsch-Arbeitsort';
    this.searchIndustry.searchInput.nativeElement.placeholder = 'Wunsch-Branch';
    this.searchBusiness.searchInput.nativeElement.placeholder = 'Bevorzugte Geschäftsbereich';
    this.placeOptions$ = fromEvent<any>(this.searchPlace.searchInput.nativeElement, 'input')
      .pipe(
        map(event => event.target.value),
        debounceTime(325),
        distinctUntilChanged(),
        switchMap(search => {
          if (search.length !== 0) {
            return this.searchService.getTowns('de', `${search}`);
          }
          return of([]);
        })
      );
    this.industryOptions$ = fromEvent<any>(this.searchIndustry.searchInput.nativeElement, 'input')
      .pipe(
        map(event => event.target.value),
        debounceTime(325),
        distinctUntilChanged(),
        switchMap(search => {
          if (search.length !== 0) {
            return this.searchService.getIndustryBranches('de', `${search}`);
          }
          return of([]);
        })
      );
    this.benefitsOptions$ = fromEvent<any>(this.searchBenefits.searchInput.nativeElement, 'input')
      .pipe(
        map(event => event.target.value),
        debounceTime(325),
        distinctUntilChanged(),
        switchMap(search => {
          if (search.length !== 0) {
            return this.searchService.getBenefits('de', `${search}`);
          }
          return of([]);
        })
      );
    this.businessOptions$ = fromEvent<any>(this.searchBusiness.searchInput.nativeElement, 'input')
      .pipe(
        map(event => event.target.value),
        debounceTime(325),
        distinctUntilChanged(),
        switchMap(search => {
          if (search.length !== 0) {
            return this.searchService.getBusinessBranches('de', `${search}`);
          }
          return of([]);
        })
      );
  }

  public initForm = () => {
    this.form = this.fb.group({
      searchPreferences: this.fb.group({
        salaryExpectations: this.fb.group({
          min: [null, [FormValidators.numberValidation]],
          max: [null, [FormValidators.numberValidation]]
        }),
        willingToRelocate: [false],
        allDesiredPlaces: [false],
        readyToStartJobFrom: [''],
        travellingReady: [null],
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
    forkJoin([profile$, dropdownOptions$])
      .pipe(
        map(([profile, dropdownOptions]) => {
          if (profile && profile.profile && profile.profile.searchPreferences && dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              searchPreferences: profile.profile.searchPreferences,
              dropdownOptions: {
                employment_type: dropdownOptions.dropdownOptions.employment_type,
                working_hours: dropdownOptions.dropdownOptions.working_hours,
                travelling: dropdownOptions.dropdownOptions.travelling
              }
            };
          }
          return [profile, dropdownOptions];
        })
      )
      .subscribe((res: any) => {
        this.dropdownOptions = res.dropdownOptions;
        this.patchFormValue(res.searchPreferences);
        console.log('res', res);
      });
  }

  public patchFormValue = (searchPreferences) => {
    this.form.get('searchPreferences').patchValue({
      salaryExpectations: {
        min: searchPreferences.salaryExpectations.min,
        max: searchPreferences.salaryExpectations.max,
      },
      travellingReady: searchPreferences.travellingReady ? searchPreferences.travellingReady : null,
      readyToStartJobFrom: searchPreferences.readyToStartJobFrom,
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
