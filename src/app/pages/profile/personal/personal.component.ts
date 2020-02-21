import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  public formData: object;
  public form: FormGroup;
  public personal: FormGroupName;
  public contact: FormGroupName;
  public residence: FormGroupName;

  constructor(
    public formBuilder: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.init();
  }

  public formInit = (profileData: any = {}) => {
    this.form = this.formBuilder.group({
      personal: this.formBuilder.group({
        academicTitle: [profileData.personal.academicTitle ?? ''],
        birthPlace: [profileData.personal.birthPlace ?? ''],
        dateBirth: [profileData.personal.dateBirth ?? ''],
        firstName: [profileData.personal.firstName ?? ''],
        gender: [profileData.personal.gender ?? 'Male'],
        lastName: [profileData.personal.lastName ?? ''],
        middleName: [profileData.personal.middleName ?? ''],
        nationality: [profileData.personal.nationality ?? '']
      }),
      contact: this.formBuilder.group({
        facebook: [profileData.contact.facebook ?? ''],
        instagram: [profileData.contact.instagram ?? ''],
        linkedin: [profileData.contact.linkedin ?? ''],
        phoneNumberLandline: [profileData.contact.phoneNumberLandline ?? ''],
        phoneNumberMobile: [profileData.contact.phoneNumberMobile ?? ''],
        skype: [profileData.contact.skype ?? ''],
        xing: [profileData.contact.xing ?? ''],
        residence: this.formBuilder.group({
          houseNumber: [profileData.contact.residence.houseNumber ?? ''],
          place: [profileData.contact.residence.place ?? ''],
          street: [profileData.contact.residence.street ?? ''],
          zipCode: [profileData.contact.residence.zipCode ?? ''],
        })
      }),
    });
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
        profileData => {
          console.log('[ EDIT PROFILE DATA ]', profileData);
          this.formInit(profileData);
          this.formData = this.form.value;
        },
        err => {
          console.log('[ ERROR EDIT PROFILE DATA ]', err);
        },
        () => {
          console.log('[ EDIT PROFILE DATA DONE ]');
        }
      );
  }

  public submit = (field: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.formData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields did not apologize ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.formData = this.form.value;
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
}
