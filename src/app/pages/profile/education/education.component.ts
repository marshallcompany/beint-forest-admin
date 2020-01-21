import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormGroupName } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  form: FormGroup;
  education: FormGroupName;
  schools: FormArray;
  universities: FormArray;
  specialEducation: FormArray;

  public profile: any;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.init();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        map((fullProfileData: any) => {
          if (fullProfileData.profile && fullProfileData.profile.education) {
            return {
              education: fullProfileData.profile.education
            };
          }
          return fullProfileData;
        })
      )
      .subscribe(
        profileData => {
          this.profile = profileData;
          this.formInit(profileData);
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

  public formInit = (profileData) => {
    this.form = this.formBuilder.group({
      education: this.formBuilder.group({
        schools: this.formBuilder.array([]),
        universities: this.formBuilder.array([]),
        specialEducation: this.formBuilder.array([]),
      })
    });

    this.schools = this.form.get('education').get('schools') as FormArray;
    this.universities = this.form.get('education').get('universities') as FormArray;
    this.specialEducation = this.form.get('education').get('specialEducation') as FormArray;

    this.schoolGroupInit(profileData);
    this.specialEducationGroupInit(profileData);
    this.universityGroupInit(profileData);
  }
  // SCHOOL GROUP
  public createSchoolGroup = (schools?: any): FormGroup => {
    if (schools) {
      return this.formBuilder.group({
        certificate: [null],
        dateFinish: [!schools.dateFinish ? '' : schools.dateFinish],
        degree: [!schools.degree ? '' : schools.degree],
        note: [!schools.note ? '' : schools.note],
        schoolName: [!schools.schoolName ? '' : schools.schoolName]
      });
    } else {
      return this.formBuilder.group({
        certificate: [null],
        dateFinish: [''],
        degree: [''],
        note: [''],
        schoolName: ['']
      });
    }
  }
  public addSchoolItem = (feild?: any) => {
    if (feild) {
      this.schools.push(this.createSchoolGroup(feild));
    } else {
      this.schools.push(this.createSchoolGroup());
    }
  }
  public schoolGroupInit = (profileData) => {
    if (profileData.education.schools.length !== 0) {
      profileData.education.schools.forEach(element => {
        this.addSchoolItem(element);
      });
    } else {
      this.addSchoolItem();
    }
  }
  // SPECIAL EDUCATION
  public createSpecialEducationGroup = (specialEducation?: any): FormGroup => {
    if (specialEducation) {
      return this.formBuilder.group({
        certificate: [null],
        dateFinish: [!specialEducation.dateFinish ? '' : specialEducation.dateFinish],
        isCompleted: [!specialEducation.isCompleted ? '' : specialEducation.isCompleted],
        note: [!specialEducation.note ? '' : specialEducation.note],
        professionalEducation: [!specialEducation.professionalEducation ? '' : specialEducation.professionalEducation],
        trainingCompany: [!specialEducation.trainingCompany ? '' : specialEducation.trainingCompany],
        trainingLocation: [!specialEducation.trainingLocation ? '' : specialEducation.trainingLocation],
      });
    } else {
      return this.formBuilder.group({
        certificate: [null],
        dateFinish: [''],
        isCompleted: [true],
        note: [''],
        professionalEducation: [''],
        trainingCompany: [''],
        trainingLocation: [''],
      });
    }
  }
  public addSpecialEducationItem = (feild?: any) => {
    if (feild) {
      this.specialEducation.push(this.createSpecialEducationGroup(feild));
    } else {
      this.specialEducation.push(this.createSpecialEducationGroup());
    }
  }
  public specialEducationGroupInit = (profileData) => {
    if (profileData.education.specialEducation.length !== 0) {
      profileData.education.specialEducation.forEach(element => {
        this.addSpecialEducationItem(element);
      });
    } else {
      this.addSpecialEducationItem();
    }
  }
  // UNIVERSITY
  public createUniversityGroup = (university?: any): FormGroup => {
    if (university) {
      return this.formBuilder.group({
        certificate: [null],
        courseOfStudy: [!university.courseOfStudy ? '' : university.courseOfStudy],
        dateFinish: [!university.dateFinish ? '' : university.dateFinish],
        dateStart: [!university.dateStart ? '' : university.dateStart],
        degree: [!university.degree ? '' : university.degree],
        highestDegree: [!university.highestDegree ? '' : university.highestDegree],
        note: [!university.note ? '' : university.note],
        specialization: [!university.specialization ? '' : university.specialization],
        titleThesis: [!university.titleThesis ? '' : university.titleThesis],
        universityName: [!university.universityName ? '' : university.universityName],
      });
    } else {
      return this.formBuilder.group({
        certificate: [null],
        courseOfStudy: [''],
        dateFinish: [''],
        dateStart: [''],
        degree: [''],
        highestDegree: [''],
        note: [''],
        specialization: [''],
        titleThesis: [''],
        universityName: [''],
      });
    }
  }

  public addUniversityItem = (feild?: any) => {
    if (feild) {
      this.universities.push(this.createUniversityGroup(feild));
    } else {
      this.universities.push(this.createUniversityGroup());
    }
  }

  public universityGroupInit = (profileData) => {
    if (profileData.education.universities.length !== 0) {
      profileData.education.universities.forEach(element => {
        this.addUniversityItem(element);
      });
    } else {
      this.addUniversityItem();
    }
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
