import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormGroupName, FormControl } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map } from 'rxjs/internal/operators/map';
import { NotificationService } from 'src/app/services/notification.service';

import * as moment from 'moment';

@Component({
  selector: 'app-personal-contact',
  templateUrl: './personal-contact.component.html',
  styleUrls: ['./personal-contact.component.scss']
})
export class PersonalContactComponent implements OnInit {

  public form: FormGroup;
  public personal: FormGroupName;
  public contact: FormGroupName;
  public residence: FormGroupName;

  constructor(
    public formBuilder: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.init();
  }

  public formInit = (profileData) => {
    this.form = this.formBuilder.group({
      personal: this.formBuilder.group({
        academicTitle: new FormControl(!profileData.personal.academicTitle ? '' : profileData.personal.academicTitle),
        avatarUri: new FormControl(null),
        birthPlace: new FormControl(!profileData.personal.birthPlace ? '' : profileData.personal.birthPlace),
        dateBirth: new FormControl(!profileData.personal.dateBirth ? '' : profileData.personal.dateBirth),
        firstName: new FormControl(!profileData.personal.firstName ? '' : profileData.personal.firstName),
        gender: new FormControl(!profileData.personal.gender ? 'male' : profileData.personal.gender),
        lastName: new FormControl(!profileData.personal.lastName ? '' : profileData.personal.lastName),
        middleName: new FormControl(!profileData.personal.middleName ? '' : profileData.personal.middleName),
        nationality: new FormControl(!profileData.personal.nationality ? '' : profileData.personal.nationality)
      }),
      contact: this.formBuilder.group({
        facebook: new FormControl(!profileData.contact.facebook ? '' : profileData.contact.facebook),
        instagram: new FormControl(!profileData.contact.instagram ? '' : profileData.contact.instagram),
        linkedin: new FormControl(!profileData.contact.linkedin ? '' : profileData.contact.linkedin),
        phoneNumberLandline: new FormControl(!profileData.contact.phoneNumberLandline ? '' : profileData.contact.phoneNumberLandline),
        phoneNumberMobile: new FormControl(!profileData.contact.phoneNumberMobile ? '' : profileData.contact.phoneNumberMobile),
        skype: new FormControl(!profileData.contact.skype ? '' : profileData.contact.skype),
        xing: new FormControl(!profileData.contact.xing ? '' : profileData.contact.xing),
        residence: this.formBuilder.group({
          houseNumber: new FormControl(profileData.contact.residence === undefined ? '' : profileData.contact.residence.houseNumber),
          place: new FormControl(profileData.contact.residence === undefined ? '' : profileData.contact.residence.place),
          street: new FormControl(profileData.contact.residence === undefined ? '' : profileData.contact.residence.street),
          zipCode: new FormControl(profileData.contact.residence === undefined ? '' : profileData.contact.residence.zipCode),
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
      .pipe()
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
  next() {
    this.router.navigate(['profile/education']);
  }
}
