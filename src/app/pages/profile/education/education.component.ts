import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormGroupName, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { map, debounceTime, share, switchMap } from 'rxjs/operators';
import { MatExpansionPanel, MatDialog } from '@angular/material';
import { SearchService } from 'src/app/services/search.service';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import * as moment from 'moment';
import { ConfirmModalComponent } from 'src/app/modal/confirm/confirm-modal.component';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, AfterViewInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-02.svg',
    nameCategory: 'Berufliche Ausbildung',
    nextCategory: 'professional-background',
    prevCategory: 'personal'
  };

  public accordionsStatus: boolean;
  @ViewChild('accordion01', { static: false }) accordion01: MatExpansionPanel;
  @ViewChild('accordion02', { static: false }) accordion02: MatExpansionPanel;
  @ViewChild('accordion03', { static: false }) accordion03: MatExpansionPanel;

  $countriesList: Observable<string[]>;
  $citiesList: Observable<string[]>;
  $apprenticeshipList: Observable<string[]>;
  $specializationList: Observable<string[]>;
  $degreeList: Observable<string[]>;

  public form: FormGroup;
  public education: FormGroupName;


  currentDate = moment().toDate();
  previousDate = moment().add(-1, 'day').toDate();

  public dropdownOptions: object;
  public educationData: any;

  constructor(
    public fb: FormBuilder,
    private profileService: ProfileService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.init();
    this.formInit();
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
          if (profile && profile.profile && profile.profile.education && dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              education: profile.profile.education,
              dropdownOptions: {
                school_types: dropdownOptions.dropdownOptions.school_types,
                school_graduation: dropdownOptions.dropdownOptions.school_graduation,
                university_study_times: dropdownOptions.dropdownOptions.university_study_times
              }
            };
          }
          return [profile, dropdownOptions];
        })
      )
      .subscribe(
        (data: any) => {
          this.educationData = data.education;
          this.dropdownOptions = data.dropdownOptions;
          this.patchFormValue(data.education);
          console.log('[ EDUCATION DATA ]', data);
        },
        err => {
          console.log('[ ERROR EDUCATION DATA ]', err);
        }
      );
  }

  public formInit = () => {
    this.form = this.fb.group({
      education: this.fb.group({
        schools: this.fb.array([]),
        specialEducation: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        }),
        universities: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        })
      })
    });
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

  public onOpenAccordion() {
    this.accordion01.opened
      .subscribe(
        ($event) => {
          if (this.schoolsArray.controls.length) {
            return;
          }
          this.schoolsArray.push((this.createFormGroup({}, 'schools')));
        }),
      this.accordion02.opened
        .subscribe(
          ($event) => {
            if (this.specialEducationArray.controls.length) {
              return;
            }
            this.specialEducationArray.push(this.createFormGroup({}, 'specialEducation'));
          });
    this.accordion03.opened
      .subscribe(
        ($event) => {
          if (this.universitiesArray.controls.length) {
            return;
          }
          this.universitiesArray.push(this.createFormGroup({}, 'universities'));
        });
  }

  public get schoolsArray(): FormArray {
    return this.form.get('education').get('schools') as FormArray;
  }

  public get specialEducationArray(): FormArray {
    return this.form.get('education').get('specialEducation').get('items') as FormArray;
  }
  public get universitiesArray(): FormArray {
    return this.form.get('education').get('universities').get('items') as FormArray;
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'schools':
        return this.fb.group({
          schoolType: [data && data.schoolType ? data.schoolType : null, Validators.required],
          schoolName: [data && data.schoolName ? data.schoolName : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null, Validators.required],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          graduation: [data && data.graduation ? data.graduation : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', Validators.required]
        });
      case 'specialEducation':
        return this.fb.group({
          professionalEducation: [data && data.professionalEducation ? data.professionalEducation : null, Validators.required],
          company: [data && data.company ? data.company : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null, Validators.required],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          professionalSchool: [data && data.professionalSchool ? data.professionalSchool : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', Validators.required],
          isNoVocationTraining: [data && data.isNoVocationTraining ? data.isNoVocationTraining : false],
        });
      case 'universities':
        return this.fb.group({
          degreeProgramTitle: [data && data.degreeProgramTitle ? data.degreeProgramTitle : '', Validators.required],
          specialization: [data && data.specialization ? data.specialization : null, Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateFinish: [data && data.dateFinish ? data.dateFinish : null, Validators.required],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          typeOfDegree: [data && data.typeOfDegree ? data.typeOfDegree : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', Validators.required],
          typeOfStudyTime: [data && data.typeOfStudyTime ? data.typeOfStudyTime : null, Validators.required],
          universityName: [data && data.universityName ? data.universityName : '', Validators.required],
          priorities: this.fb.array(data && data.priorities ? data.priorities : [], Validators.required),
          titleThesis: [data && data.titleThesis ? data.titleThesis : '', Validators.required],
        });
      default:
        break;
    }
  }
  private patchFormValue(education) {
    this.form.patchValue({
      education: {
        specialEducation: {
          isNotRelevant: education.specialEducation && education.specialEducation.isNotRelevant ? education.specialEducation.isNotRelevant : false
        },
        universities: {
          isNotRelevant: education.universities && education.universities.isNotRelevant ? education.universities.isNotRelevant : false
        }
      }
    });
    if (education.schools.length) {
      education.schools.forEach(item => {
        this.schoolsArray.push(this.createFormGroup(item, 'schools'));
      });
    }
    if (!education.specialEducation.isNotRelevant && education.specialEducation.items.length) {
      education.specialEducation.items.forEach(item => {
        this.specialEducationArray.push(this.createFormGroup(item, 'specialEducation'));
      });
    }
    if (!education.universities.isNotRelevant && education.universities.items.length) {
      education.universities.items.forEach(item => {
        this.universitiesArray.push(this.createFormGroup(item, 'universities'));
      });
    }
  }

  public setFormGroup = (status: string, relevant: boolean) => {
    if (relevant) {
      const isNotRelevant = this.form.get('education').get(status).get('isNotRelevant').value;
      if (isNotRelevant) {
        return;
      }
    }
    this[`${status}Array`].push(this.createFormGroup({}, status));
  }

  public deleteFormGroup = (nameArray: FormArray, index: number, formGroupName?: string) => {
    const FormGroupValue = nameArray.at(index).value;
    let FormGroupStatus = false;
    Object.keys(FormGroupValue).forEach(key => {
      if (FormGroupValue[key] && FormGroupValue[key].length > 0 && typeof (FormGroupValue[key]) !== 'boolean') {
        FormGroupStatus = true;
      }
    });
    if (FormGroupStatus) {
      this.matDialog.open(ConfirmModalComponent).afterClosed()
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
              nameArray.push(this.createFormGroup({}, formGroupName));
              this.submit('');
            } else {
              nameArray.removeAt(index);
              this.submit('');
            }
          },
          err => console.log('[ DELETE ERROR ]', err)
        );
    } else {
      if (nameArray && formGroupName && nameArray.controls.length < 2) {
        nameArray.removeAt(index);
        nameArray.push(this.createFormGroup({}, formGroupName));
      } else {
        nameArray.removeAt(index);
      }
    }
  }

  getCountryList(query: string) {
    this.$countriesList = this.searchService.getCountries('de', query).pipe(debounceTime(500), share());
  }

  getCityList(query: string) {
    this.$citiesList = this.searchService.getTowns('de', `${query}`).pipe(debounceTime(400), share());
  }

  getApprenticeshipList(query: string) {
    this.$apprenticeshipList = this.searchService.getProfessionalEducation('de', `${query}`).pipe(debounceTime(400), share());
  }

  getSpecializationList(query: string) {
    this.$specializationList = this.searchService.getSpecializationUniversity('de', `${query}`).pipe(debounceTime(400), share());
  }

  getDegreeList(query: string) {
    this.$degreeList = this.searchService.getDegreeUniversity('de', `${query}`).pipe(debounceTime(400), share());
  }

  setTodayDate(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateEnd').setValue(this.currentDate);
    }
    this.submit('bis heute');
  }

  public accordionChange = () => {
    if (!this.accordion01.expanded) {
      this.accordionsStatus = false;
    }
  }

  public submit = (field: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.educationData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields have not changed ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.educationData = this.form.value;
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
}
