import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormGroupName, FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map, switchMap, delay, concatMap, toArray } from 'rxjs/operators';
import { Observable, of, throwError, from } from 'rxjs';
import { SearchService } from '../../../services/search.service';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import { AccordionItemComponent } from 'src/app/components/accordion/accordion-item.component';
import { Router } from '@angular/router';
import { fadeAnimation } from 'src/app/animations/router-animations';
import { DateService } from 'src/app/services/date.service';
import { FormValidators } from 'src/app/validators/validators';
import { AutocompleteDataService } from 'src/app/services/autocomplete-data.service';


@Component({
  selector: 'app-professional-background',
  templateUrl: './professional-background.component.html',
  styleUrls: ['./professional-background.component.scss'],
  animations: [fadeAnimation]
})
export class ProfessionalBackgroundComponent implements OnInit, AfterViewInit {

  @ViewChild('accordion01', { static: false }) accordion01: AccordionItemComponent;
  @ViewChild('accordion02', { static: false }) accordion02: AccordionItemComponent;
  @ViewChild('accordion03', { static: false }) accordion03: AccordionItemComponent;

  businessArea$: Observable<Array<string>>;
  industryArea$: Observable<Array<string>>;

  dropdownOptions$: Observable<any>;

  public dropdownOptions: any;

  public navSettings = {
    iconCategory: '../assets/image/profile/category-03.svg',
    imgDesktop: '../assets/image/profile/professional-background/image-desktop.svg',
    imgMobile: '../assets/image/profile/professional-background/image-mobile.svg',
    nameCategory: 'Beruflicher Werdegang',
    nextCategory: 'profile/search-settings',
    prevCategory: 'profile/education',
    loading: true
  };

  private firstPersonalData: object;
  public professionalBackgroundData: object;
  public viewPortStatus = true;

  public form: FormGroup;
  public workExperience: FormGroupName;
  public employmentConditions: FormGroupName;
  public employmentBusinessAreaControl = new FormControl(['']);
  public independentBusinessAreaControl = new FormControl(['']);
  public $countriesList: Observable<string[]>;

  public otherExperienceCityArray = [];
  public otherExperienceCountryArray = [];

  public independentExperienceCityArray = [];
  public independentExperienceCountryArray = [];

  currentDate = moment().toDate();
  previousDate = moment().add(-1, 'day').toDate();


  constructor(
    public router: Router,
    public dateService: DateService,
    public autocompleteDataService: AutocompleteDataService,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.init();
    this.formInit();

    this.$countriesList = this.searchService.getCountries('de', '');
    this.businessArea$ = this.searchService.getBusinessBranches('de', '');
    this.industryArea$ = this.searchService.getIndustryBranches('de', '');
  }

  ngAfterViewInit() {
    this.onOpenAccordion();
  }

  public init = () => {
    const profile$ = this.profileService.getProfile();
    const dropdownOptions$ = this.profileService.getLocalBundle('de');
    this.checkViewPort();
    forkJoin([profile$, dropdownOptions$])
      .pipe(
        map(([profile, dropdownOptions]) => {
          if (profile && profile.profile && profile.profile.workExperience && dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              workExperience: profile.profile.workExperience,
              dropdownOptions: {
                employment_type: dropdownOptions.dropdownOptions.employment_type,
                career_level: dropdownOptions.dropdownOptions.career_level
              }
            };
          }
          return [profile, dropdownOptions];
        })
      )
      .subscribe((res: any) => {
        console.log('res', res);
        this.professionalBackgroundData = res.workExperience;
        this.dropdownOptions = res.dropdownOptions;
        this.patchFormValue(res.workExperience);
        this.navSettings.loading = false;
      });
  }

  public checkViewPort = () => {
    if (window.innerWidth <= 768) {
      this.viewPortStatus = false;
    }
    return;
  }

  public get employmentConditionsArray(): FormArray {
    return this.form.get('workExperience').get('employmentConditions').get('items') as FormArray;
  }

  public get independentExperienceArray(): FormArray {
    return this.form.get('workExperience').get('independentExperience').get('items') as FormArray;
  }

  public get otherExperienceArray(): FormArray {
    return this.form.get('workExperience').get('otherExperience').get('items') as FormArray;
  }

  public formInit = () => {
    this.form = this.fb.group({
      workExperience: this.fb.group({
        employmentConditions: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        }),
        independentExperience: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        }),
        otherExperience: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        })
      })
    });
  }

  public googleAddressChange = (data, formGroup: FormGroup, fields: Array<string>, message: string, onlyCountry?: boolean) => {
    of(data)
      .pipe(
        switchMap(value => {
          if (value === '[NO VALUE]') {
            this.cleaningFormControl(formGroup, fields, message);
            return throwError('[NO VALUE]');
          }
          return of(value);
        }),
        switchMap(googleAddress => {
          if (!googleAddress.city && !onlyCountry) {
            return throwError('[NO CITY]');
          }
          return of(
            {
              workPlace: googleAddress.city,
              country: googleAddress.country
            }
          );
        })
      )
      .subscribe(
        result => {
          console.log('RESULT', result);
          this.updateFormControl(formGroup, fields, result, message);
        },
        error => {
          if (error === '[NO CITY]') {
            this.notificationService.notify('Standortinformationen unvollständig, fehlende Stadt');
          }
          console.log('[ GOOGLE ADDRESS ERROR ]', error);
        }
      );
  }

  public cleaningFormControl = (formGroup: FormGroup, fields: Array<string>, message: string) => {
    fields.forEach(item => {
      formGroup.get(item).setValue('');
    });
    this.submit(message);
  }

  public updateFormControl = (formGroup: FormGroup, fields: Array<string>, value, message: string) => {
    fields.forEach(item => {
      formGroup.get(item).setValue(value[item]);
    });
    this.submit(message);
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'employmentConditions':
        return this.fb.group({
          company: [data && data.company ? data.company : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : ''],
          dateStartString: [data && data.dateStart ? this.dateService.updateFormControlDate(data.dateStart, 'm.y') : ''],
          dateEnd: [data && data.dateEnd ? data.dateEnd : ''],
          dateEndString: [data && data.dateEnd ? this.dateService.updateFormControlDate(data.dateEnd, 'm.y') : ''],
          country: [data && data.country ? data.country : null, Validators.required],
          workPlace: [data && data.workPlace ? data.workPlace : null, Validators.required],
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          careerLevel: [data && data.careerLevel ? data.careerLevel : null, Validators.required],
          jobDescription: [data && data.jobDescription ? data.jobDescription : '', Validators.required],
          employmentType: [data && data.employmentType ? data.employmentType : null, Validators.required],
          industryBranch: [data && data.industryBranch ? data.industryBranch : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],

          businessArea: this.fb.array(data && data.businessArea ? data.businessArea : []),
          businessAreaControl: [data && data.businessArea ? data.businessArea : null, Validators.required]
        }, this.initFormValidation('dateStartString', 'dateEndString'));
      case 'independentExperience':
        return this.fb.group({
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          companyName: [data && data.companyName ? data.companyName : ''],
          dateStart: [data && data.dateStart ? data.dateStart : '', Validators.required],
          dateStartString: [data && data.dateStart ? this.dateService.updateFormControlDate(data.dateStart, 'm.y') : ''],
          dateEnd: [data && data.dateEnd ? data.dateEnd : ''],
          dateEndString: [data && data.dateEnd ? this.dateService.updateFormControlDate(data.dateEnd, 'm.y') : ''],
          country: [data && data.country ? data.country : null, Validators.required],
          workPlace: [data && data.workPlace ? data.workPlace : null, Validators.required],
          jobDescription: [data && data.jobDescription ? data.jobDescription : '', Validators.required],
          isFreelancer: [data && data.isFreelancer ? data.isFreelancer : false],
          tilToday: [data && data.tilToday ? data.tilToday : false],

          location: [data.workPlace && data.country ? `${data.workPlace + `, ` + data.country}` : ''],
          businessArea: this.fb.array(data && data.businessArea ? data.businessArea : []),
          businessAreaControl: [data && data.businessArea ? data.businessArea : null, Validators.required]
        }, this.initFormValidation('dateStartString', 'dateEndString'));
      case 'otherExperience':
        return this.fb.group({
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : '', Validators.required],
          dateStartString: [data && data.dateStart ? this.dateService.updateFormControlDate(data.dateStart, 'm.y') : ''],
          dateEnd: [data && data.dateEnd ? data.dateEnd : ''],
          dateEndString: [data && data.dateEnd ? this.dateService.updateFormControlDate(data.dateEnd, 'm.y') : ''],
          country: [data && data.country ? data.country : null, Validators.required],
          workPlace: [data && data.workPlace ? data.workPlace : null, Validators.required],
          jobDescription: [data && data.jobDescription ? data.jobDescription : '', Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],

          location: [data.workPlace && data.country ? `${data.workPlace + `, ` + data.country}` : ''],
        }, this.initFormValidation('dateStartString', 'dateEndString'));
      default:
        break;
    }
  }

  public initFormValidation = (from: string, to: string) => {
    let formValidation: object;
    formValidation = {
      validator: FormValidators.dateCheck(
        from,
        to
      )
    };
    return formValidation;
  }

  public onOpenAccordion() {
    this.accordion01.toggleEmitter
      .subscribe(
        ($event) => {
          if (this.employmentConditionsArray.controls.length) {
            return;
          }
          this.employmentConditionsArray.push((this.createFormGroup(null, 'employmentConditions')));
        }),
      this.accordion02.toggleEmitter
        .subscribe(
          ($event) => {
            if (this.independentExperienceArray.controls.length) {
              return;
            }
            this.independentExperienceArray.push(this.createFormGroup(null, 'independentExperience'));
          }),
      this.accordion03.toggleEmitter
        .subscribe(
          ($event) => {
            if (this.otherExperienceArray.controls.length) {
              return;
            }
            this.otherExperienceArray.push(this.createFormGroup(null, 'otherExperience'));
          });
  }

  public triggerClick = (id: string) => {
    const element: HTMLElement = document.getElementById(id) as HTMLElement;
    element.click();
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
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexNotFullDateNumber)) {
      formGroup.get(formControl).setValue(this.dateService.createMonthYearDate(valueDateString));
      if (formGroup.errors === null) {
        this.submit(message);
      }
    }
    if (formGroup.get(formControlDateString).value.match(this.dateService.regexNotFullDateEmpty)) {
      formGroup.get(formControl).setValue('');
      this.submit(message);
    }
  }

  private patchFormValue(searchPreferences) {
    this.form.patchValue({
      workExperience: {
        employmentConditions: {
          isNotRelevant: searchPreferences.employmentConditions && searchPreferences.employmentConditions.isNotRelevant ? searchPreferences.employmentConditions.isNotRelevant : false,
        },
        independentExperience: {
          isNotRelevant: searchPreferences.independentExperience && searchPreferences.independentExperience.isNotRelevant ? searchPreferences.independentExperience.isNotRelevant : false,
        },
        otherExperience: {
          isNotRelevant: searchPreferences.otherExperience && searchPreferences.otherExperience.isNotRelevant ? searchPreferences.otherExperience.isNotRelevant : false,
        }
      }
    });
    if (searchPreferences.employmentConditions.items.length) {
      searchPreferences.employmentConditions.items.forEach(item => {
        this.employmentConditionsArray.push(this.createFormGroup(item, 'employmentConditions'));
      });
    }
    if (searchPreferences.independentExperience.items.length) {
      searchPreferences.independentExperience.items.forEach(item => {
        this.independentExperienceArray.push(this.createFormGroup(item, 'independentExperience'));
        // if (item && item.country) {
        //   this.independentExperienceCountryArray.push(item.country);
        //   this.residenceChanges(this.independentExperienceCountryArray, 'independentExperience');
        // }
      });
    }
    if (searchPreferences.otherExperience.items.length) {
      searchPreferences.otherExperience.items.forEach(item => {
        this.otherExperienceArray.push(this.createFormGroup(item, 'otherExperience'));
        // if (item && item.country) {
        //   this.otherExperienceCountryArray.push(item.country);
        //   this.residenceChanges(this.otherExperienceCountryArray, 'otherExperience');
        // }
      });
    }
  }

  // public residenceChanges = (arrayCountry, arrayCity) => {
  //   from(arrayCountry)
  //     .pipe(
  //       delay(500),
  //       concatMap((country: string) => this.searchService.getTowns('de', '', country)),
  //       toArray()
  //     )
  //     .subscribe(
  //       res => {
  //         switch (arrayCity) {
  //           case 'otherExperience':
  //             this.otherExperienceCityArray = res;
  //             break;
  //           case 'independentExperience':
  //             this.independentExperienceCityArray = res;
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     );
  // }

  // public selectionResidence = (event, index, array, formGroup: FormGroup) => {
  //   this.searchService.getTowns('de', '', event)
  //     .pipe()
  //     .subscribe(
  //       res => {
  //         array[index] = res;
  //         if (formGroup.controls[index].get('workPlace').value) {
  //           formGroup.controls[index].get('workPlace').setValue(null);
  //           this.submit('Land and Ort');
  //         } else {
  //           this.submit('Land');
  //         }
  //       }
  //     );
  // }

  notRelevant(groupName: string, nameArray: string, nameCategory: string) {
    const isRelevant = this.form.get(groupName).get(nameCategory).get('isNotRelevant').value;
    if (!isRelevant) {
      this[nameArray].controls[0].enable();
      return;
    }
    const length = this[nameArray].controls.length;
    for (let i = 0; i < length; i++) {
      this[nameArray].removeAt(0);
    }
    this[nameArray].push(this.createFormGroup({}, nameCategory));
    this.submit('Für mich nicht relevant');
  }

  setTodayDate(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateEnd').setValue('');
      group.get('dateEndString').setValue('');
    }
    this.submit('bis heute');
  }

  public deleteFormGroup = (nameArray: FormArray, index: number, formGroupName?: string, cityArray?: Array<string>) => {
    const FormGroupValue = nameArray.at(index).value;
    let FormGroupStatus = false;
    Object.keys(FormGroupValue).forEach(key => {
      if (FormGroupValue[key] && FormGroupValue[key].length > 0 && typeof (FormGroupValue[key]) !== 'boolean') {
        FormGroupStatus = true;
      }
    });
    if (FormGroupStatus) {
      this.matDialog.open(ConfirmModalComponent, { panelClass: 'confirm-dialog' }).afterClosed()
        .pipe(
          switchMap(value => {
            if (!value || value === undefined) {
              return throwError('Cancel dialog');
            }
            return of(value);
          })
        )
        .subscribe(
          dialog => {
            if (nameArray && formGroupName && nameArray.controls.length < 2) {
              if (cityArray) {
                cityArray.splice(index, 1);
              }
              nameArray.removeAt(index);
              nameArray.push(this.createFormGroup({}, formGroupName));
              this.submit();
            } else {
              if (cityArray) {
                cityArray.splice(index, 1);
              }
              nameArray.removeAt(index);
              this.submit();
            }
          },
          err => console.log('[ DELETE ERROR ]', err)
        );
    } else {
      if (nameArray && formGroupName && nameArray.controls.length < 2) {
        nameArray.removeAt(index);
        nameArray.push(this.createFormGroup({}, formGroupName));
        this.submit();
      } else {
        nameArray.removeAt(index);
        this.submit();
      }
    }
  }

  public deleteTags = (index, itemIndex, formArrayName, field, message) => {
    this[formArrayName].at(index).controls[field].removeAt(itemIndex);
    this.submit(message);
  }

  public formArrayPush = (value, formArrayName, field, index) => {
    this[formArrayName].controls[index].controls[field].push(this.fb.control(value.slice(-1)[0]));
    this.submit('field');
  }

  public setFormGroup = (status?: string) => {
    const isNotRelevant = this.form.get('workExperience').get(status).get('isNotRelevant').value;
    if (isNotRelevant) {
      return;
    }
    this[`${status}Array`].push(this.createFormGroup({}, status));
  }

  public submit = (field?: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.firstPersonalData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields have not changed ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.firstPersonalData = this.form.value;
          if ( field ) {
            this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
          }
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }

}
