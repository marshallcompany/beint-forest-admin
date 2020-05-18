import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog, MatExpansionPanel } from '@angular/material';
import { forkJoin, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import * as moment from 'moment';

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
  public currentDate = moment().toDate();
  public previousDate = moment().add(-1, 'day').toDate();

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

  public get volunteeringArray(): FormArray {
    return this.form.get('miscellaneous').get('volunteering').get('items') as FormArray;
  }

  public formInit = () => {
    this.form = this.fb.group({
      miscellaneous: this.fb.group({
        hobbies: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([], Validators.required)
        }),
        volunteering: this.fb.group({
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
    if (!isRelevant && this[nameArray].length) {
      this[nameArray].reset();
      this.submit('Für mich nicht relevant');
      return;
    }
    if (nameCategory !== 'hobbies') {
      const length = this[nameArray].controls.length;
      for (let i = 0; i < length; i++) {
        this[nameArray].removeAt(0);
      }
      this[nameArray].push(this.createFormGroup({}, nameCategory));
    }
    this.submit('Für mich nicht relevant');
  }

  public setFormGroup = (status?: string) => {
    const isNotRelevant = this.form.get('miscellaneous').get(status).get('isNotRelevant').value;
    if (isNotRelevant) {
      return;
    }
    this[`${status}Array`].push(this.createFormGroup({}, status));
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'volunteering':
        return this.fb.group({
          dateFrom: [data && data.dateFrom ? data.dateFrom : null, Validators.required],
          dateTo: [data && data.dateTo ? data.dateTo : '', Validators.required],
          description: [data && data.description ? data.description : null, Validators.required],
          institution: [data && data.institution ? data.institution : null, Validators.required],
          volunteeringTitle: [data && data.volunteeringTitle ? data.volunteeringTitle : null, Validators.required],
          tilToday: [data && data.tilToday ? data.tilToday : false],
        });
      default:
        break;
    }
  }

  setTodayDate(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateTo').setValue(this.currentDate.toISOString());
    }
    this.submit('bis heute');
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

  public patchFormValue(miscellaneous) {
    this.form.patchValue({
      miscellaneous: {
        hobbies: {
          isNotRelevant: miscellaneous.hobbies && miscellaneous.hobbies.isNotRelevant ? miscellaneous.hobbies.isNotRelevant : false
        },
        volunteering: {
          isNotRelevant: miscellaneous.volunteering && miscellaneous.volunteering.isNotRelevant ? miscellaneous.volunteering.isNotRelevant : false
        },
      }
    });
    if (miscellaneous.hobbies.items.length) {
      miscellaneous.hobbies.items.forEach(item => {
        this.hobbiesArray.push(this.fb.control(item));
      });
    }
    if (miscellaneous.volunteering.items.length) {
      miscellaneous.volunteering.items.forEach(item => {
        this.volunteeringArray.push(this.createFormGroup(item, 'volunteering'));
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
