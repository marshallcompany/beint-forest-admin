import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormGroupName, Validators, FormControl } from '@angular/forms';
import { FormValidators } from '../../../validators/validators';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { map, switchMap } from 'rxjs/operators';
import { MatExpansionPanel, MatDialog } from '@angular/material';
import { SearchService } from 'src/app/services/search.service';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import * as moment from 'moment';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';

interface DropDownOptions {
  school_types: Array<string[]>;
  school_graduation: Array<string[]>;
  university_study_times: Array<string[]>;
  language_level: Array<string[]>;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit, AfterViewInit {
  public mask = '0.00';
  public navSettings = {
    iconCategory: '../assets/image/profile/category-02.svg',
    imgDesktop: '../assets/image/profile/education/image-desktop.svg',
    imgMobile: '../assets/image/profile/education/image-mobile.svg',
    nameCategory: 'Berufliche Ausbildung',
    nextCategory: 'profile/professional-background',
    prevCategory: 'profile/personal'
  };

  public accordionsStatus: boolean;
  @ViewChild('accordion01', { static: false }) accordion01: MatExpansionPanel;
  @ViewChild('accordion02', { static: false }) accordion02: MatExpansionPanel;
  @ViewChild('accordion03', { static: false }) accordion03: MatExpansionPanel;
  @ViewChild('accordion04', { static: false }) accordion04: MatExpansionPanel;
  @ViewChild('accordion05', { static: false }) accordion05: MatExpansionPanel;
  @ViewChild('accordion06', { static: false }) accordion06: MatExpansionPanel;

  $countriesList: Observable<string[]>;
  $citiesList: Observable<string[]>;
  $apprenticeshipList: Observable<string[]>;
  $specializationList: Observable<string[]>;
  $degreeList: Observable<string[]>;
  $skillsList: Observable<string[]>;
  $langList: Observable<string[]>;

  public form: FormGroup;
  public education: FormGroupName;
  public universityPrioritiesControl = new FormControl('', Validators.maxLength(100));
  public primarySkillsControl = new FormControl(['']);
  public secondarySkillsControl = new FormControl(['']);


  currentDate = moment().toDate();
  previousDate = moment().add(-1, 'day').toDate();

  public dropdownOptions: DropDownOptions;
  public educationData: any;

  constructor(
    public fb: FormBuilder,
    private profileService: ProfileService,
    private searchService: SearchService,
    private notificationService: NotificationService,
    private matDialog: MatDialog
  ) {
    this.accordionsStatus = true;
  }

  ngOnInit() {
    this.formInit();
    this.init();
    this.initDropDownList();
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
                university_study_times: dropdownOptions.dropdownOptions.university_study_times,
                language_level: dropdownOptions.dropdownOptions.language_level
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
        }),
        additionalEducations: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        }),
        skillsData: this.fb.group({
          primarySkills: this.fb.array([]),
          secondarySkills: this.fb.array([])
        }),
        linguisticProficiency: this.fb.array([])
      })
    });
    if (this.form && this.form.get('education').get('skillsData')) {
      this.form.get('education').get('skillsData').valueChanges
      .pipe()
      .subscribe(
        () => {
          this.primarySkillsControl.patchValue(this.primarySkillsArray.length !== 0 ? this.primarySkillsArray.value : ['']);
          this.secondarySkillsControl.patchValue(this.secondarySkillsArray.length !== 0 ? this.secondarySkillsArray.value : ['']);
        }
      );
    }
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
    this.accordion04.opened
      .subscribe(
        ($event) => {
          if (this.additionalEducationsArray.controls.length) {
            return;
          }
          this.additionalEducationsArray.push(this.createFormGroup({}, 'additionalEducations'));
        });
    this.accordion06.opened
      .subscribe(
        ($event) => {
          if (this.linguisticProficiencyArray.controls.length) {
            return;
          }
          this.linguisticProficiencyArray.push(this.createFormGroup({}, 'linguisticProficiency'));
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

  public get additionalEducationsArray(): FormArray {
    return this.form.get('education').get('additionalEducations').get('items') as FormArray;
  }

  public get primarySkillsArray(): FormArray {
    return this.form.get('education').get('skillsData').get('primarySkills') as FormArray;
  }

  public get secondarySkillsArray(): FormArray {
    return this.form.get('education').get('skillsData').get('secondarySkills') as FormArray;
  }

  public get linguisticProficiencyArray(): FormArray {
    return this.form.get('education').get('linguisticProficiency') as FormArray;
  }

  public pushFormControl = (formArray: FormArray, nameArray: string, nameFormControl: FormControl, index: any, message: string) => {
    const childArray = formArray.at(index).get(nameArray) as FormArray;
    if (formArray && nameArray && nameFormControl && childArray) {
      childArray.push(this.fb.control(nameFormControl.value));
      nameFormControl.reset();
      this.submit(message);
    }
    return;
  }

  public formArrayPush = (value, formArrayName: FormArray, field, element?: any) => {
    if (value && formArrayName && field) {
      formArrayName.push(this.fb.control(value.slice(-1)[0]));
      if (element && this.primarySkillsArray.controls.length > 2) {
        element.searchInput.nativeElement.blur();
      }
      if (element && this.secondarySkillsArray.controls.length > 9) {
        element.searchInput.nativeElement.blur();
      }
      this.submit(field);
    }
    return;
  }

  public deleteTags = (index, itemIndex, formArrayName, field, message) => {
    this[formArrayName].at(index).controls[field].removeAt(itemIndex);
    this.submit(message);
  }

  public singleDeleteTags = (index, formArrayName: FormArray, message: string) => {
    formArrayName.removeAt(index);
    this.submit(message);
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'schools':
        return this.fb.group({
          schoolType: [data && data.schoolType ? data.schoolType : null, Validators.required],
          schoolName: [data && data.schoolName ? data.schoolName : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          graduation: [data && data.graduation ? data.graduation : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', [Validators.required, FormValidators.maxValueValidation]]
        });
      case 'specialEducation':
        return this.fb.group({
          professionalEducation: [data && data.professionalEducation ? data.professionalEducation : null, Validators.required],
          company: [data && data.company ? data.company : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          professionalSchool: [data && data.professionalSchool ? data.professionalSchool : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', [Validators.required, FormValidators.maxValueValidation]],
          isNoVocationTraining: [data && data.isNoVocationTraining ? data.isNoVocationTraining : false],
        });
      case 'universities':
        return this.fb.group({
          degreeProgramTitle: [data && data.degreeProgramTitle ? data.degreeProgramTitle : '', Validators.required],
          specialization: [data && data.specialization ? data.specialization : null, Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          typeOfDegree: [data && data.typeOfDegree ? data.typeOfDegree : null, Validators.required],
          grade: [data && data.grade ? data.grade : '', [Validators.required, FormValidators.maxValueValidation]],
          typeOfStudyTime: [data && data.typeOfStudyTime ? data.typeOfStudyTime : null, Validators.required],
          universityName: [data && data.universityName ? data.universityName : '', Validators.required],
          priorities: this.fb.array(data && data.priorities ? data.priorities : [], Validators.required),
          titleThesis: [data && data.titleThesis ? data.titleThesis : '', Validators.required],
        });
      case 'additionalEducations':
        return this.fb.group({
          trainingTitle: [data && data.trainingTitle ? data.trainingTitle : '', Validators.required],
          trainingDescription: [data && data.trainingDescription ? data.trainingDescription : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
          tilToday: [data && data.tilToday ? data.tilToday : false]
        });
      case 'linguisticProficiency':
        return this.fb.group({
          skillLevel: [data && data.skillLevel ? data.skillLevel : null, Validators.required],
          language: [data && data.language ? data.language : null, Validators.required]
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
        },
        additionalEducations: {
          isNotRelevant: education.additionalEducations && education.additionalEducations.isNotRelevant ? education.additionalEducations.isNotRelevant : false
        }
      }
    });
    if (education.schools.length) {
      education.schools.forEach(item => {
        this.schoolsArray.push(this.createFormGroup(item, 'schools'));
      });
    }
    if (education.specialEducation.items.length) {
      education.specialEducation.items.forEach(item => {
        this.specialEducationArray.push(this.createFormGroup(item, 'specialEducation'));
      });
    }
    if (education.universities.items.length) {
      education.universities.items.forEach(item => {
        this.universitiesArray.push(this.createFormGroup(item, 'universities'));
      });
    }
    if (education.additionalEducations.items.length) {
      education.additionalEducations.items.forEach(item => {
        this.additionalEducationsArray.push(this.createFormGroup(item, 'additionalEducations'));
      });
    }
    if (education && education.skillsData && education.skillsData.primarySkills.length) {
      education.skillsData.primarySkills.forEach(item => {
        this.primarySkillsArray.push(this.fb.control(item));
      });
    }
    if (education && education.skillsData && education.skillsData.secondarySkills) {
      education.skillsData.secondarySkills.forEach(item => {
        this.secondarySkillsArray.push(this.fb.control(item));
      });
    }
    if (education && education.linguisticProficiency && education.linguisticProficiency.length) {
      education.linguisticProficiency.forEach(item => {
        this.linguisticProficiencyArray.push(this.createFormGroup(item, 'linguisticProficiency'));
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

  public clearArrayField = (formGroupValue) => {
    let formArrayStatus = false;
    Object.keys(formGroupValue).forEach(key => {
      formGroupValue[key].forEach(element => {
        formArrayStatus = true;
      });
    });
    if (formArrayStatus) {
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
            Object.keys(formGroupValue).forEach((key) => {
              if (formGroupValue[key].length) {
                this[key + 'Array'].clear();
                this.submit('');
              }
            });
          },
          err => console.log('[ DELETE ERROR ]', err)
        );
    }
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
              nameArray.push(this.createFormGroup({}, formGroupName));
              this.submit();
            } else {
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

  public initDropDownList = () => {
    this.$langList = this.searchService.getLang('de', '');
    this.$skillsList = this.searchService.getSkills('de', '');
    this.$countriesList = this.searchService.getCountries('de', '');
    this.$citiesList = this.searchService.getTowns('de', '');
    this.$specializationList = this.searchService.getSpecializationUniversity('de', '');
    this.$degreeList = this.searchService.getDegreeUniversity('de', '');
    this.$apprenticeshipList = this.searchService.getProfessionalEducation('de', '');
  }

  setTodayDate(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateEnd').setValue('');
    }
    this.submit('bis heute');
  }

  public accordionChange = (eventName: string) => {
    if (eventName === 'open') {
      if (this.accordion01.expanded || this.accordion02.expanded
          || this.accordion03.expanded || this.accordion04.expanded
          || this.accordion05.expanded || this.accordion06.expanded) {
        this.accordionsStatus = false;
      }
    }
    if (eventName === 'close') {
      if (!this.accordion01.expanded && !this.accordion02.expanded
          && !this.accordion03.expanded && !this.accordion04.expanded
          && !this.accordion05.expanded && !this.accordion06.expanded) {
        this.accordionsStatus = true;
      }
    }
  }

  public submit = (field?: string) => {
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
          if (field) {
            this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
          }
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
}
