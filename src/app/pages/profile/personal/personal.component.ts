import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map } from 'rxjs/internal/operators/map';
import { NotificationService } from 'src/app/services/notification.service';

import { switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/menu/profile.svg',
    nameCategory: 'Persönliches & Kontakt',
    nextCategory: 'professional-background'
  };

  public firstPersonalData: object;
  public form: FormGroup;
  public personal: FormGroupName;
  public contact: FormGroupName;
  public residence: FormGroupName;

  constructor(

    public formBuilder: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
  ) {
    this.form = this.formBuilder.group({
      personal: this.formBuilder.group({
        academicTitle: [''],
        birthPlace: [''],
        dateBirth: [''],
        firstName: [''],
        gender: [''],
        lastName: [''],
        middleName: [''],
        nationality: ['']
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
          zipCode: [''],
        })
      }),
    });
  }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        map((fullProfileData: any) => {
          if (fullProfileData.profile && fullProfileData.profile.personal && fullProfileData.profile.contact) {
            return {
              personal: fullProfileData.profile.personal,
              contact: fullProfileData.profile.contact
            };
          }
          return fullProfileData;
        })
      )
      .subscribe(
        personalData => {
          console.log('[ EDIT PROFILE DATA ]', personalData);
          this.patchFormValue(personalData);
          this.firstPersonalData = this.form.value;
        },
        err => {
          console.log('[ ERROR EDIT PROFILE DATA ]', err);
        },
        () => console.log('[ EDIT PROFILE DATA DONE ]')
      );
  }

  public patchFormValue = (personalData) => {
    this.form.patchValue({
      personal: {
        academicTitle: personalData.personal.academicTitle ? personalData.personal.academicTitle : '',
        birthPlace: personalData.personal.birthPlace ? personalData.personal.birthPlace : '',
        dateBirth: personalData.personal.dateBirth ? personalData.personal.dateBirth : '',
        firstName: personalData.personal.firstName ? personalData.personal.firstName : '',
        gender: personalData.personal.gender ? personalData.personal.gender : null,
        lastName: personalData.personal.lastName ? personalData.personal.lastName : '',
        middleName: personalData.personal.middleName ? personalData.personal.middleName : '',
        nationality: personalData.personal.nationality ? personalData.personal.nationality : ''
      },
      contact: {
        facebook: personalData.contact.facebook ? personalData.contact.facebook : '',
        instagram: personalData.contact.instagram ? personalData.contact.instagram : '',
        linkedin: personalData.contact.linkedin ? personalData.contact.linkedin : '',
        phoneNumberMobile: personalData.contact.phoneNumberMobile ? personalData.contact.phoneNumberMobile : '',
        xing: personalData.contact.xing ? personalData.contact.xing : '',
        residence: {
          houseNumber: personalData.contact.residence.houseNumber ? personalData.contact.residence.houseNumber : '',
          place: personalData.contact.residence.place ? personalData.contact.residence.place : '',
          street: personalData.contact.residence.street ? personalData.contact.residence.street : '',
          zipCode: personalData.contact.residence.zipCode ? personalData.contact.residence.zipCode : '',
        }
      },
    });
  }

  public submit = (field: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.firstPersonalData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields did not apologize ]');
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
}
