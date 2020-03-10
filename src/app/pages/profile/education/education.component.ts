import { Component, OnInit, ViewChild } from '@angular/core';
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
export class EducationComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-02.svg',
    nameCategory: 'Berufliche Ausbildung',
    nextCategory: 'professional-background',
    prevCategory: 'personal'
  };

  public accordionsStatus: boolean;
  @ViewChild('accordion01', { static: false }) accordion01: MatExpansionPanel;

  $countriesList: Observable<string[]>;
  $citiesList: Observable<string[]>;

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
        schools: this.fb.array([])
      })
    });
  }

  public get schoolsArray(): FormArray {
    return this.form.get('education').get('schools') as FormArray;
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'schools':
        return this.fb.group({
          schoolType: [data && data.schoolType ? data.schoolType : null, Validators.required],
          schoolName: [data && data.schoolName ? data.schoolName : '', Validators.required],
          dateStart: [data && data.dateStart ? data.dateStart : null],
          dateEnd: [data && data.dateEnd ? data.dateEnd : null],
          country: [data && data.country ? data.country : null, Validators.required],
          place: [data && data.place ? data.place : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
          graduation: [data && data.graduation ? data.graduation : null],
          grade: [data && data.grade ? data.grade : '', Validators.required]
        });
      default:
        break;
    }
  }
  private patchFormValue(education) {
    if (education.schools.length) {
      education.schools.forEach(item => {
        this.schoolsArray.push(this.createFormGroup(item, 'schools'));
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
            if (value === false) {
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
