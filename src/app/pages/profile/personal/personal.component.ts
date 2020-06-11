import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map } from 'rxjs/internal/operators/map';
import { NotificationService } from 'src/app/services/notification.service';

import { debounceTime, share, switchMap, filter } from 'rxjs/operators';
import { throwError, of, Observable, forkJoin } from 'rxjs';
import { SearchService } from '../../../services/search.service';

interface DropDownOptions {
  academic_titles: Array<string[]>;
  gender: Array<string[]>;
  maritalStatus: Array<string[]>;
}

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/menu/profile.svg',
    imgDesktop: '../assets/image/profile/personal/image-desktop.svg',
    imgMobile: '../assets/image/profile/personal/image-mobile.svg',
    nameCategory: 'Persönliches & Kontakt',
    nextCategory: 'profile/education',
    prevCategory: 'profile/about'
  };

  public firstPersonalData: object;
  public dropdownOptions: DropDownOptions;

  public form: FormGroup;
  public personal: FormGroupName;
  public contact: FormGroupName;
  public residence: FormGroupName;
  public landList$: Observable<string[]>;
  public cityList$: Observable<string[]>;
  public nationalitiesList$: Observable<string[]>;
  public zip$: Observable<string[]>;

  constructor(
    public formBuilder: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private searchService: SearchService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.init();
    this.nationalitiesList$ = this.searchService.getNationalities('de');
  }

  public init = () => {
    const getProfileData$ = this.profileService.getProfile();
    const getLocalBundle$ = this.profileService.getLocalBundle('de');
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
                maritalStatus: fullLocalBundle.dropdownOptions.maritalStatus
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
        },
        err => {
          console.log('[ ERROR EDIT PROFILE DATA ]', err);
        },
        () => console.log('[ EDIT PROFILE DATA DONE ]')
      );
  }

  public initForm = () => {
    this.form = this.formBuilder.group({
      personal: this.formBuilder.group({
        academicTitle: [''],
        birthPlace: [''],
        dateBirth: [''],
        firstName: [''],
        gender: [''],
        lastName: [''],
        middleName: [''],
        nationality: [''],
        maritalStatus: [null]
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
          addressAddition: ['']
        })
      }),
    });
  }

  public patchFormValue = (personalData) => {
    this.form.patchValue({
      personal: {
        academicTitle: personalData.personal && personalData.personal.academicTitle ? personalData.personal.academicTitle : null,
        birthPlace: personalData.personal && personalData.personal.birthPlace ? personalData.personal.birthPlace : '',
        dateBirth: personalData.personal && personalData.personal.dateBirth ? personalData.personal.dateBirth : '',
        firstName: personalData.personal && personalData.personal.firstName ? personalData.personal.firstName : '',
        gender: personalData.personal && personalData.personal.gender ? personalData.personal.gender : null,
        lastName: personalData.personal && personalData.personal.lastName ? personalData.personal.lastName : '',
        middleName: personalData.personal && personalData.personal.middleName ? personalData.personal.middleName : '',
        nationality: personalData.personal && personalData.personal.nationality ? personalData.personal.nationality : null,
        maritalStatus: personalData.personal && personalData.personal.maritalStatus ? personalData.personal.maritalStatus : null
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
          addressAddition: personalData.contact && personalData.contact.residence && personalData.contact.residence.addressAddition ? personalData.contact.residence.addressAddition : ''
        }
      },
    });
  }

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

  onChangeLand(formGroup) {
    formGroup.get('zipCode').setValue(null);
    formGroup.get('place').setValue(null);
  }

  searchCity(event) {
    this.cityList$ = this.searchService.getTowns('de', `${event.term}`).pipe(debounceTime(400), share());
  }

  searchLand($event) {
    this.landList$ = this.searchService.getCountries('de', `${$event.term}`).pipe(debounceTime(400), share());
  }

  onChangeCity(formGroup: FormGroup) {
    const place = formGroup.get('place').value;
    const country = formGroup.get('country').value;
    this.searchService.getZipCode('de', country, place, '')
      .pipe()
      .subscribe(
        (zip: Array<string>) => {
          if (zip.length) {
            formGroup.get('zipCode').setValue(zip[0]);
          }
        }
      );
  }

  onChangeZip(formGroup: FormGroup) {
    const zip = formGroup.get('zipCode').value;
    const cityControl = formGroup.get('place');
    this.searchService.getTowns('de', '', zip)
      .subscribe(
        (res: Array<string>) => {
          console.log('cities', res);
          if (res.length) {
            cityControl.setValue(res[0]);
          }
        }
      );
  }

  searchZip($event, formGroup: FormGroup) {
    const country = formGroup.get('country').value;
    this.zip$ = this.searchService.getZipCode('de', `${country}`, '', `${$event.term}`).pipe(debounceTime(400), share());
  }
}
