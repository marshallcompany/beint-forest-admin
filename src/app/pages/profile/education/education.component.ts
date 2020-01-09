import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, FormGroupName } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  schoolForm: FormGroup;
  schools: FormArray;

  universityForm: FormGroup;
  universities: FormArray;

  educationForm: FormGroup;
  specialEducation: FormArray;

  education: FormGroupName;

  public dataProfile: any;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.init();
  }


  public formInit = () => {
    if (this.dataProfile && this.dataProfile.profile && this.dataProfile.profile.education && this.dataProfile.profile.education.schools.length !== 0) {
      this.schoolForm = this.formBuilder.group({
        education: this.formBuilder.group({
          schools: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              dateFinish: new FormControl(this.dataProfile.profile.education.schools[0].dateFinish),
              degree: new FormControl(this.dataProfile.profile.education.schools[0].degree),
              note: new FormControl(this.dataProfile.profile.education.schools[0].note),
              schoolName: new FormControl(this.dataProfile.profile.education.schools[0].schoolName)
            })
            // this.createSchoolItem()
          ])
        })
      });
    } else {
      this.schoolForm = this.formBuilder.group({
        education: this.formBuilder.group({
          schools: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              dateFinish: new FormControl(''),
              degree: new FormControl(''),
              note: new FormControl(''),
              schoolName: new FormControl('')
            })
            // this.createSchoolItem()
          ])
        })
      });
    }
    if (this.dataProfile && this.dataProfile.profile && this.dataProfile.profile.education && this.dataProfile.profile.education.specialEducation.length !== 0) {
      this.educationForm = this.formBuilder.group({
        education: this.formBuilder.group({
          specialEducation: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              dateFinish: new FormControl(this.dataProfile.profile.education.specialEducation[0].dateFinish),
              isCompleted: new FormControl(this.dataProfile.profile.education.specialEducation[0].isCompleted),
              note: new FormControl(this.dataProfile.profile.education.specialEducation[0].note),
              professionalEducation: new FormControl(this.dataProfile.profile.education.specialEducation[0].professionalEducation),
              trainingCompany: new FormControl(this.dataProfile.profile.education.specialEducation[0].trainingCompany),
              trainingLocation: new FormControl(this.dataProfile.profile.education.specialEducation[0].trainingLocation),
            })
            // this.createEducationItem()
          ])
        })
      });
    } else {
      this.educationForm = this.formBuilder.group({
        education: this.formBuilder.group({
          specialEducation: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              dateFinish: new FormControl(''),
              isCompleted: new FormControl(true),
              note: new FormControl(''),
              professionalEducation: new FormControl(''),
              trainingCompany: new FormControl(''),
              trainingLocation: new FormControl(''),
            })
            // this.createEducationItem()
          ])
        })
      });
    }
    if (this.dataProfile && this.dataProfile.profile && this.dataProfile.profile.education && this.dataProfile.profile.education.universities.length !== 0) {
      this.universityForm = this.formBuilder.group({
        education: this.formBuilder.group({
          universities: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              courseOfStudy: new FormControl(this.dataProfile.profile.education.universities[0].courseOfStudy),
              dateFinish: new FormControl(this.dataProfile.profile.education.universities[0].dateFinish),
              dateStart: new FormControl(this.dataProfile.profile.education.universities[0].dateStart),
              degree: new FormControl(this.dataProfile.profile.education.universities[0].degree),
              highestDegree: new FormControl(this.dataProfile.profile.education.universities[0].highestDegree),
              note: new FormControl(this.dataProfile.profile.education.universities[0].note),
              specialization: new FormControl(this.dataProfile.profile.education.universities[0].specialization),
              titleThesis: new FormControl(this.dataProfile.profile.education.universities[0].titleThesis),
              universityName: new FormControl(this.dataProfile.profile.education.universities[0].universityName),
            })
            // this.createUniversityItem()
          ])
        })
      });
    } else {
      this.universityForm = this.formBuilder.group({
        education: this.formBuilder.group({
          universities: this.formBuilder.array([
            this.formBuilder.group({
              certificate: new FormControl(null),
              courseOfStudy: new FormControl(''),
              dateFinish: new FormControl(''),
              dateStart: new FormControl(''),
              degree: new FormControl(''),
              highestDegree: new FormControl(''),
              note: new FormControl(''),
              specialization: new FormControl(''),
              titleThesis: new FormControl(''),
              universityName: new FormControl(''),
            })
            // this.createUniversityItem()
          ])
        })
      });
    }
  }

  createSchoolItem(): FormGroup {
    return this.formBuilder.group({
      certificate: new FormControl(null),
      dateFinish: new FormControl(''),
      degree: new FormControl(''),
      note: new FormControl(''),
      schoolName: new FormControl('')
    });
  }

  addSchoolItem() {
    this.schools = this.schoolForm.get('education').get('schools') as FormArray;
    this.schools.push(this.createSchoolItem());
  }

  createUniversityItem(): FormGroup {
    return this.formBuilder.group({
      certificate: new FormControl(null),
      courseOfStudy: new FormControl(''),
      dateFinish: new FormControl(''),
      dateStart: new FormControl(''),
      degree: new FormControl(''),
      highestDegree: new FormControl(''),
      note: new FormControl(''),
      specialization: new FormControl(''),
      titleThesis: new FormControl(''),
      universityName: new FormControl(''),
    });
  }

  addUniversityItem() {
    this.universities = this.universityForm.get('education').get('universities') as FormArray;
    this.universities.push(this.createUniversityItem());
  }

  createEducationItem(): FormGroup {
    return this.formBuilder.group({
      certificate: new FormControl(null),
      dateFinish: new FormControl(''),
      isCompleted: new FormControl(''),
      note: new FormControl(''),
      professionalEducation: new FormControl(''),
      trainingCompany: new FormControl(''),
      trainingLocation: new FormControl(''),
    });
  }

  addEducationItem() {
    this.specialEducation = this.educationForm.get('education').get('specialEducation') as FormArray;
    this.specialEducation.push(this.createEducationItem());
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        // map((fullProfileData: any) => {
        //   if (fullProfileData.profile && fullProfileData.profile.personal && fullProfileData.profile.contact) {
        //     return {
        //       personal: fullProfileData.profile.personal,
        //       contact: fullProfileData.profile.contact
        //     };
        //   }
        //   return fullProfileData;
        // })
      )
      .subscribe(
        profileData => {
          this.dataProfile = profileData;
          this.formInit();
          console.log('[ EDIT PROFILE DATA ]', profileData);
        },
        err => {
          console.log('[ ERROR EDIT PROFILE DATA ]', err);
        },
        () => {
          console.log('[ EDIT PROFILE DATA DONE ]');
        }
      );
  }

  prev() {
    this.router.navigate(['profile/personal&contact']);
  }

  submit(formValue, field) {
    this.profileService.updateProfile(formValue)
      .subscribe(
        res => {
          console.log('submit', res);
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ SUBMIT ERROR ]', err);
        },
        () => {
          console.log('[ SUBMIT DONE ]');
        }
      );
  }
}
