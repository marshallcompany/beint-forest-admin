import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormGroup, FormArray, FormBuilder, FormGroupName } from '@angular/forms';
import { FormValidators } from '../../../validators/validators';
import { map, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

import * as moment from 'moment';
import { throwError, of } from 'rxjs';

@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {
  public minDate = moment().toISOString();
  public navSettings = {
    iconCategory: '../assets/image/profile/category-04.svg',
    nameCategory: 'Such-Präferenzen',
    nextCategory: 'about'
  };

  public employmentTypes;
  public preferredBusiness;
  public workingHours;
  public branches;
  public advantages;

  public valueRange;

  public form: FormGroup;

  public salaryExpectations: FormGroupName;

  public preferredBusinessAreas: FormArray;
  public preferredWorkingHours: FormArray;
  public desiredEmploymentTypes: FormArray;
  public desiredIndustryBranches: FormArray;
  public benefits: FormArray;

  public formData: object;

  constructor(
    public profileService: ProfileService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {

    this.form = this.fb.group({
      searchPreferences: this.fb.group({
        salaryExpectations: this.fb.group({
          min: [null, [FormValidators.numberValidation]],
          max: [null, [FormValidators.numberValidation]]
        }),
        desiredDestinationRadius: [''],
        willingToRelocate: [false],
        readyToStartJobFrom: [''],
        travellingReady: [null],
        desiredEmploymentTypes: this.fb.array([]),
        preferredBusinessAreas: this.fb.array([]),
        preferredWorkingHours: this.fb.array([]),
        desiredIndustryBranches: this.fb.array([]),
        benefits: this.fb.array([])
      })
    });
  }

  ngOnInit(): void {
    this.init();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe(
        map(profileDate => {
          if (profileDate && profileDate.profile && profileDate.profile.searchPreferences) {
            return {
              searchPreferences: profileDate.profile.searchPreferences
            };
          }
          return profileDate;
        })
      )
      .subscribe((res: any) => {
        console.log('res', res);
        this.form.get('searchPreferences').patchValue({
          salaryExpectations: {
            min: res.searchPreferences.salaryExpectations.min,
            max: res.searchPreferences.salaryExpectations.max,
          },
          travellingReady: res.searchPreferences.travellingReady ? res.searchPreferences.travellingReady : null,
          readyToStartJobFrom: res.searchPreferences.readyToStartJobFrom,
          willingToRelocate: res.searchPreferences.willingToRelocate,
          desiredDestinationRadius: Math.floor(res.searchPreferences.desiredDestinationRadius.$numberDecimal),
        });
        this.employmentTypes = res.searchPreferences.desiredEmploymentTypes[0];
        this.preferredBusiness = res.searchPreferences.preferredBusinessAreas[0];
        this.workingHours = res.searchPreferences.preferredWorkingHours[0];
        this.branches = res.searchPreferences.desiredIndustryBranches[0];
        this.advantages = res.searchPreferences.benefits[0];
        this.valueRange = this.form.get('searchPreferences').get('desiredDestinationRadius').value;
        this.formData = this.form.value;
      });
  }

  rangeValue = (value) => {
    this.valueRange = value.value;
  }

  pushData = (formArrayName: string, field: string, nameField?: string) => {

    this.desiredEmploymentTypes = this.form.get('searchPreferences').get('desiredEmploymentTypes') as FormArray;
    this.preferredBusinessAreas = this.form.get('searchPreferences').get('preferredBusinessAreas') as FormArray;
    this.preferredWorkingHours = this.form.get('searchPreferences').get('preferredWorkingHours') as FormArray;
    this.desiredIndustryBranches = this.form.get('searchPreferences').get('desiredIndustryBranches') as FormArray;
    this.benefits = this.form.get('searchPreferences').get('benefits') as FormArray;

    if (formArrayName && this[formArrayName]) {
      this[formArrayName].push(this.fb.control(field));
      this.submit(nameField);
    } else {
      return false;
    }
  }

  public submit = (field?) => {
    this.profileService.updateProfile(this.form.value)
      .pipe(
        switchMap(formData => {
          if (this.form.invalid) {
            return throwError('[ FORM INVALID ]');
          }
          return of(true);
        })
      )
      .subscribe(
        res => {
          console.log('[ PROFILE UPDATE ]', res);
          this.formData = this.form.value;
          this.notificationService.notify(`Field ${field} updated successfully!`, 'success');
        },
        err => {
          console.log('[ ERROR UPDATE PROFILE ]', err);
        }
      );
  }

}
