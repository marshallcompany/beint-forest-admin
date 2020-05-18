import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { forkJoin, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  styleUrls: ['./miscellaneous.component.scss']
})
export class MiscellaneousComponent implements OnInit {

  @ViewChild('accordion01', { static: false }) accordion01: MatExpansionPanel;
  @ViewChild('accordion02', { static: false }) accordion02: MatExpansionPanel;
  @ViewChild('accordion03', { static: false }) accordion03: MatExpansionPanel;

  public navSettings = {
    iconCategory: '../assets/image/profile/category-06.svg',
    nameCategory: 'Sonstiges',
    nextCategory: 'profile/about',
    prevCategory: 'profile/document'
  };

  public accordionsStatus: boolean;
  public miscellaneousData: any;
  public dropdownOptions: any;

  public form: FormGroup;
  public hobbiesControl = new FormControl(['']);

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    // private searchService: SearchService,
    private notificationService: NotificationService,
    private matDialog: MatDialog,
  ) {
    this.accordionsStatus = false;
  }

  ngOnInit(): void {
    this.init();
    this.formInit();
  }

  public init = () => {
    const profile$ = this.profileService.getProfile();
    // const dropdownOptions$ = this.profileService.getLocalBundle('de');
    forkJoin([profile$])
      .pipe(
        map(([profile]) => {
          if (profile && profile.profile && profile.profile.miscellaneous) {
            return {
              miscellaneous: {
                hobbies: profile.profile.miscellaneous.hobbies,
                awards: profile.profile.miscellaneous.awards,
                publications: profile.profile.miscellaneous.publications,
                volunteering: profile.profile.miscellaneous.volunteering
              }
            };
          }
          return [profile];
        })
      )
      .subscribe((res: any) => {
        console.log('res', res);
        this.miscellaneousData = res;
        // this.dropdownOptions = res.dropdownOptions;
        this.patchFormValue(res.miscellaneous);
      });
  }

  public get hobbiesArray(): FormArray {
    return this.form.get('miscellaneous').get('hobbies').get('items') as FormArray;
  }

  public formInit = () => {
    this.form = this.fb.group({
      miscellaneous: this.fb.group({
        hobbies: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([], Validators.required)
        })
      })
    });
  }

  public formArrayPush = (formControlValue: FormControl, formArrayName: FormArray) => {
    if (formControlValue && formArrayName) {
      formArrayName.push(this.fb.control(formControlValue.value));
      formControlValue.reset();
      this.submit('hobbies');
    }
    return;
  }

  public singleDeleteTags = (index, formArrayName: FormArray, message: string) => {
    formArrayName.removeAt(index);
    this.submit(message);
  }

  notRelevant(groupName: string, nameArray: string, nameCategory: string) {
    const isRelevant = this.form.get(groupName).get(nameCategory).get('isNotRelevant').value;
    if (!isRelevant) {
      this[nameArray].reset();
      this.submit('Für mich nicht relevant');
      return;
    }
    // this[nameArray].push(this.createFormGroup({}, nameCategory));
    this.submit('Für mich nicht relevant');
  }

  // public createFormGroup = (data: any, nameGroup: string): FormGroup => {
  //   switch (nameGroup) {
  //     case 'schools':
  //       return this.fb.group({
  //         schoolType: [data && data.schoolType ? data.schoolType : null, Validators.required],
  //         schoolName: [data && data.schoolName ? data.schoolName : '', Validators.required],
  //         dateStart: [data && data.dateStart ? data.dateStart : null, Validators.required],
  //         dateEnd: [data && data.dateEnd ? data.dateEnd : null, Validators.required],
  //         country: [data && data.country ? data.country : null, Validators.required],
  //         place: [data && data.place ? data.place : null, Validators.required],
  //         tilToday: [data && data.tilToday ? data.tilToday : false],
  //         graduation: [data && data.graduation ? data.graduation : null, Validators.required],
  //         grade: [data && data.grade ? data.grade : '', [Validators.required, FormValidators.maxValueValidation]]
  //       });
  //     default:
  //       break;
  //   }
  // }

  public patchFormValue(miscellaneous) {
    this.form.patchValue({
      miscellaneous: {
        hobbies: {
          isNotRelevant: miscellaneous.hobbies && miscellaneous.hobbies.isNotRelevant ? miscellaneous.hobbies.isNotRelevant : false
        },
      }
    });
    if (miscellaneous.hobbies.items.length) {
      miscellaneous.hobbies.items.forEach(item => {
        this.hobbiesArray.push(this.fb.control(item));
      });
    }
  }

  public submit = (field: string) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (JSON.stringify(this.miscellaneousData) === JSON.stringify(this.form.value)) {
            return throwError('[ Fields have not changed ]');
          }
          return of(formData);
        })
      )
      .subscribe(
        res => {
          console.log('[ UPDATE PROFILE ]', res);
          this.miscellaneousData = this.form.value;
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }
}
