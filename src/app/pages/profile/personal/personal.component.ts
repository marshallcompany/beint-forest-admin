import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators, FormControl, FormArray } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map } from 'rxjs/internal/operators/map';
import { NotificationService } from 'src/app/services/notification.service';

import { switchMap } from 'rxjs/operators';
import { throwError, of, Observable, forkJoin } from 'rxjs';
import { SearchService } from '../../../services/search.service';
import { Router } from '@angular/router';
import { fadeAnimation } from 'src/app/animations/router-animations';
import { DateService } from 'src/app/services/date.service';
import { AutocompleteDataService } from 'src/app/services/autocomplete-data.service';

interface DropDownOptions {
  academic_titles: Array<string[]>;
  gender: Array<string[]>;
  maritalStatus: Array<string[]>;
  driving_license_category: Array<string[]>;
}

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
  animations: [fadeAnimation]
})
export class PersonalComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/menu/profile.svg',
    imgDesktop: '../assets/image/profile/personal/image-desktop.svg',
    imgMobile: '../assets/image/profile/personal/image-mobile.svg',
    nameCategory: 'Persönliches & Kontakt',
    nextCategory: 'profile/education',
    prevCategory: 'profile/about',
    loading: true
  };

  public viewPortStatus = true;
  public firstPersonalData: object;
  public dropdownOptions: DropDownOptions;

  public form: FormGroup;
  public personal: FormGroupName;
  public contact: FormGroupName;
  public residence: FormGroupName;
  public driverLicenseControl = new FormControl(['']);

  public landList$: Observable<string[]>;
  public cityList$: Observable<string[]>;
  public nationalitiesList$: Observable<string[]>;
  public zip$: Observable<string[]>;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public dateService: DateService,
    public autocompleteDataService: AutocompleteDataService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.initForm();
    this.init();
    this.nationalitiesList$ = this.searchService.getNationalities('de');
    // this.landList$ = this.searchService.getCountries('de', '');
  }

  public init = () => {
    const getProfileData$ = this.profileService.getProfile();
    const getLocalBundle$ = this.profileService.getLocalBundle('de');
    this.checkViewPort();
    forkJoin([getProfileData$, getLocalBundle$])
      .pipe(
        map(([fullProfileData, fullLocalBundle]) => {
          if (fullProfileData.profile && fullProfileData.profile.personal && fullProfileData.profile.contact && fullLocalBundle && fullLocalBundle.dropdownOptions) {
            return {
              personal: fullProfileData.profile.personal,
              contact: fullProfileData.profile.contact,
              dropdownOptions: {
                academic_titles: fullLocalBundle.dropdownOptions.academic_titles,
                gender: fullLocalBundle.dropdownOptions.gender,
                maritalStatus: fullLocalBundle.dropdownOptions.maritalStatus,
                driving_license_category: fullLocalBundle.dropdownOptions.driving_license_category
              }
            };
          }
          return [fullProfileData, fullLocalBundle];
        })
      )
      .subscribe(
        (res: any) => {
          console.log('[ EDIT PROFILE DATA ]', res);
          this.patchFormValue(res);
          this.dropdownOptions = res.dropdownOptions;
          this.firstPersonalData = this.form.value;
          this.navSettings.loading = false;
        },
        err => {
          console.log('[ ERROR EDIT PROFILE DATA ]', err);
        },
        () => console.log('[ EDIT PROFILE DATA DONE ]')
      );
    if (this.form) {
      this.form.valueChanges
        .pipe()
        .subscribe(
          () => {
            this.driverLicenseControl.patchValue(this.driverLicensesArray.length !== 0 ? this.driverLicensesArray.value : ['']);
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

  public initForm = () => {
    this.form = this.formBuilder.group({
      personal: this.formBuilder.group({
        academicTitle: [''],
        birthPlace: [''],
        dateBirth: [''],
        dateBirthString: [''],
        firstName: [''],
        gender: [''],
        lastName: [''],
        middleName: [''],
        nationality: [''],
        maritalStatus: [null],
        driverLicenses: this.formBuilder.array([])
      }),
      contact: this.formBuilder.group({
        facebook: [''],
        instagram: [''],
        linkedin: [''],
        phoneNumberMobile: [''],
        xing: [''],
        residence: this.formBuilder.group({
          houseNumber: [''],
          place: [''],
          street: [''],
          zipCode: [null],
          country: [null, Validators.required],
          addressAddition: [''],
          location: ['']
        })
      }),
    });
  }

  public get driverLicensesArray(): FormArray {
    return this.form.get('personal').get('driverLicenses') as FormArray;
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


  public googleAddressChange = (data, formGroup: FormGroup, fields: Array<string>, message: string) => {
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
        const arr: Array<Observable<any>> = [
          of(this.autocompleteDataService.getCity(googleAddress)),
          of(this.autocompleteDataService.getCountry(googleAddress)),
          of(this.autocompleteDataService.getPostCode(googleAddress)),
          of(googleAddress.formatted_address)
        ];
        return forkJoin(arr);
      }),
      switchMap(([cityItem, countryItem, postalCodeItem, value]) => {
        if (!cityItem) {
          return throwError('[NO CITY]');
        }
        if (!postalCodeItem) {
          return throwError('[NO POSTAL CODE]');
        }
        return of(
          {
            place: cityItem,
            country: countryItem,
            zipCode: postalCodeItem,
            value: `${value}`
          }
        );
      })
    )
    .subscribe(
      res => {
        console.log('RESULT', res);
        this.updateFormControl(formGroup, fields, res, message);
      },
      error => {
        if (error === '[NO POSTAL CODE]') {
          this.notificationService.notify('Standortinformationen unvollständig, fehlende Postleitzahl');
        }
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

  public dateSave = (message: string, formControl: FormControl) => {
    if (formControl.value.match(this.dateService.regexFullDateNumber)) {
      this.form.get('personal').get('dateBirth').setValue(this.dateService.createDayMonthYearDate(formControl.value));
      this.submit(message);
    }
    if (formControl.value.match(this.dateService.regexFullDateEmpty)) {
      this.form.get('personal').get('dateBirth').setValue('');
      this.submit(message);
    }
  }

  public patchFormValue = (personalData) => {
    this.form.patchValue({
      personal: {
        academicTitle: personalData.personal && personalData.personal.academicTitle ? personalData.personal.academicTitle : null,
        birthPlace: personalData.personal && personalData.personal.birthPlace ? personalData.personal.birthPlace : '',
        dateBirth: personalData.personal && personalData.personal.dateBirth ? personalData.personal.dateBirth : '',
        dateBirthString: personalData.personal && personalData.personal.dateBirth ? this.dateService.updateFormControlDate(personalData.personal.dateBirth, 'd.m.y') : '',
        firstName: personalData.personal && personalData.personal.firstName ? personalData.personal.firstName : '',
        gender: personalData.personal && personalData.personal.gender ? personalData.personal.gender : null,
        lastName: personalData.personal && personalData.personal.lastName ? personalData.personal.lastName : '',
        middleName: personalData.personal && personalData.personal.middleName ? personalData.personal.middleName : '',
        nationality: personalData.personal && personalData.personal.nationality ? personalData.personal.nationality : null,
        maritalStatus: personalData.personal && personalData.personal.maritalStatus ? personalData.personal.maritalStatus : null,
      },
      contact: {
        facebook: personalData.contact && personalData.contact.facebook ? personalData.contact.facebook : '',
        instagram: personalData.contact && personalData.contact.instagram ? personalData.contact.instagram : '',
        linkedin: personalData.contact && personalData.contact.linkedin ? personalData.contact.linkedin : '',
        phoneNumberMobile: personalData.contact && personalData.contact.phoneNumberMobile ? personalData.contact.phoneNumberMobile : '',
        xing: personalData.contact && personalData.contact.xing ? personalData.contact.xing : '',
        residence: {
          houseNumber: personalData.contact && personalData.contact.residence && personalData.contact.residence.houseNumber ? personalData.contact.residence.houseNumber : '',
          place: personalData.contact && personalData.contact.residence && personalData.contact.residence.place ? personalData.contact.residence.place : null,
          street: personalData.contact && personalData.contact.residence && personalData.contact.residence.street ? personalData.contact.residence.street : '',
          zipCode: personalData.contact && personalData.contact.residence && personalData.contact.residence.zipCode ? personalData.contact.residence.zipCode : null,
          country: personalData.contact && personalData.contact.residence && personalData.contact.residence.country ? personalData.contact.residence.country : null,
          addressAddition: personalData.contact && personalData.contact.residence && personalData.contact.residence.addressAddition ? personalData.contact.residence.addressAddition : '',
          location: personalData.contact.residence.zipCode &&
                    personalData.contact.residence.place &&
                    personalData.contact.residence.country ?
                    `${personalData.contact.residence.zipCode + ` ` +
                      personalData.contact.residence.place + `, ` +
                      personalData.contact.residence.country}`
                      : ''
        }
      },
    });
    if (personalData && personalData.personal && personalData.personal.driverLicenses) {
      personalData.personal.driverLicenses.forEach(element => {
        this.driverLicensesArray.push(this.formBuilder.control(element));
      });
    }
    // if (personalData.contact.residence.country) {
    //   const countryValue = personalData.contact.residence.country;
    //   this.cityList$ = this.searchService.getTowns('de', '', countryValue);
    // }
    // if (personalData.contact.residence.country && personalData.contact.residence.place) {
    //   const place = personalData.contact.residence.place;
    //   const country = personalData.contact.residence.country;
    //   this.zip$ = this.searchService.getZipCode('de', country, place, '');
    // }
  }

  public formArrayPush = (value, formArrayName: FormArray, message: string, element?: any) => {
    if (value && formArrayName && message) {
      formArrayName.push(this.formBuilder.control(value.slice(-1)[0]));
      element.searchInput.nativeElement.blur();
      this.submit(message);
    }
    return;
  }

  public deleteTags = (index, formArrayName: FormArray, message: string) => {
    formArrayName.removeAt(index);
    this.submit(message);
  }

  // onChangeLand(formGroup) {
  //   if (formGroup.get('country').value) {
  //     this.cityList$ = this.searchService.getTowns('de', '', formGroup.get('country').value);
  //   }
  //   of(true)
  //     .pipe(
  //       switchMap(() => {
  //         if (!formGroup.get('country').value) {
  //           formGroup.get('place').setValue(null);
  //           formGroup.get('zipCode').setValue(null);
  //           return throwError('[ NO COUNTRY ]');
  //         }
  //         return this.searchService.getTowns('de', '', formGroup.get('country').value);
  //       }),
  //       switchMap(towns => {
  //         let filterStatus;
  //         towns.filter(v => {
  //           if (v === formGroup.get('place').value) {
  //             filterStatus = true;
  //           }
  //         });
  //         if (filterStatus) {
  //           return throwError('[ THERE ARE MATCHES ]');
  //         }
  //         return of(towns);
  //       })
  //     )
  //     .subscribe(
  //       result => {
  //         formGroup.get('place').setValue(null);
  //         formGroup.get('zipCode').setValue(null);
  //         this.submit('Land');
  //       },
  //       err => {
  //         console.log('Change Land', err);
  //         this.submit('Land');
  //       }
  //     );
  // }

  // onChangeCity(formGroup: FormGroup) {
  //   const place = formGroup.get('place').value;
  //   const country = formGroup.get('country').value;
  //   if (place && country) {
  //     this.zip$ = this.searchService.getZipCode('de', country, place, '');
  //   }
  //   if (!place && formGroup.get('zipCode').value) {
  //     formGroup.get('zipCode').setValue(null);
  //   }
  //   this.submit('Wohnort');
  // }

  public submit = (field: string) => {
    console.log('FV: ', this.form.value);
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
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }

  phoneValidation = (event: any) => {
    const pattern = /[0-9\+\ \()\/]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
