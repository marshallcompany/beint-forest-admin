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


@Component({
  selector: 'app-professional-background',
  templateUrl: './professional-background.component.html',
  styleUrls: ['./professional-background.component.scss']
})
export class ProfessionalBackgroundComponent implements OnInit, AfterViewInit {
  public accordionsStatus: boolean;

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
    prevCategory: 'profile/education'
  };

  private firstPersonalData: object;
  public professionalBackgroundData: object;

  public form: FormGroup;
  public workExperience: FormGroupName;
  public employmentConditions: FormGroupName;
  public employmentBusinessAreaControl = new FormControl(['']);
  public independentBusinessAreaControl = new FormControl(['']);
  public $countriesList: Observable<string[]>;

  public $citiesList: Observable<string[]>;

  public otherExperienceCityArray = [];
  public otherExperienceCountryArray = [];

  currentDate = moment().toDate();
  previousDate = moment().add(-1, 'day').toDate();


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
  ) {
    this.accordionsStatus = true;
  }

  ngOnInit(): void {
    this.init();
    this.formInit();

    this.$countriesList = this.searchService.getCountries('de', '');
    this.businessArea$ = this.searchService.getBusinessBranches('de', '');
    this.industryArea$ = this.searchService.getIndustryBranches('de', '');
    // this.$citiesList = this.searchService.getTowns('de', '');

  }

  ngAfterViewInit() {
    this.onOpenAccordion();
  }

  public init = () => {
    const profile$ = this.profileService.getProfile();
    const dropdownOptions$ = this.profileService.getLocalBundle('de');
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
      });
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

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'employmentConditions':
        return this.fb.group({
          company: [data && data.company ? data.company : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
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
        });
      case 'independentExperience':
        return this.fb.group({
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          companyName: [data && data.companyName ? data.companyName : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null, Validators.required],
          country: [data && data.country ? data.country : null, Validators.required],
          workPlace: [data && data.workPlace ? data.workPlace : null, Validators.required],
          jobDescription: [data && data.jobDescription ? data.jobDescription : '', Validators.required],
          isFreelancer: [data && data.isFreelancer ? data.isFreelancer : false],
          tilToday: [data && data.tilToday ? data.tilToday : false],

          businessArea: this.fb.array(data && data.businessArea ? data.businessArea : []),
          businessAreaControl: [data && data.businessArea ? data.businessArea : null, Validators.required]
        });
      case 'otherExperience':
        return this.fb.group({
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null, Validators.required],
          country: [data && data.country ? data.country : null, Validators.required],
          workPlace: [data && data.workPlace ? data.workPlace : null, Validators.required],
          jobDescription: [data && data.jobDescription ? data.jobDescription : '', Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false]
        });
      default:
        break;
    }
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

  public accordionChange = ($event) => {
    if ($event) {
      this.accordionsStatus = false;
    } else {
      this.accordionsStatus = true;
    }
    // if (eventName === 'open') {
    //   if (this.accordion01.expanded || this.accordion02.expanded || this.accordion03.expanded) {
    //     this.accordionsStatus = false;
    //   }
    // }
    // if (eventName === 'close') {
    //   if (!this.accordion01.expanded && !this.accordion02.expanded && !this.accordion03.expanded) {
    //     this.accordionsStatus = true;
    //   }
    // }
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
      });
    }
    if (searchPreferences.otherExperience.items.length) {
      searchPreferences.otherExperience.items.forEach(item => {
        this.otherExperienceArray.push(this.createFormGroup(item, 'otherExperience'));
        if (item && item.country) {
          this.otherExperienceCountryArray.push(item.country);
          this.residenceChanges(this.otherExperienceCountryArray, 'otherExperience');
        }
      });
    }
  }

  public residenceChanges = (arrayCountry, arrayCity) => {
    from(arrayCountry)
      .pipe(
        delay(500),
        concatMap((country: string) => this.searchService.getTowns('de', '', country)),
        toArray()
      )
      .subscribe(
        res => {
          switch (arrayCity) {
            case 'otherExperience':
              this.otherExperienceCityArray = res;
              break;
            default:
              break;
          }
        }
      );
  }

  public selectionResidence = (event, index, array, formGroup: FormGroup) => {
    this.searchService.getTowns('de', '', event)
      .pipe()
      .subscribe(
        res => {
          array[index] = res;
          if (formGroup.controls[index].get('workPlace').value) {
            formGroup.controls[index].get('workPlace').setValue(null);
            this.submit('Land and Ort');
          } else {
            this.submit('Land');
          }
        }
      );
  }

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
              nameArray.removeAt(index);
              cityArray.splice(index, 1);
              nameArray.push(this.createFormGroup({}, formGroupName));
              this.submit();
            } else {
              nameArray.removeAt(index);
              cityArray.splice(index, 1);
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
