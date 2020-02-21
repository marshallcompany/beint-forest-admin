import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { FormGroup, FormArray, FormBuilder, FormGroupName } from '@angular/forms';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-search-settings',
  templateUrl: './search-settings.component.html',
  styleUrls: ['./search-settings.component.scss']
})
export class SearchSettingsComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-04.svg',
    nameCategory: 'Such-Präferenzen',
    nextCategory: null
  };

  public branches: string;
  public workingHours: string;
  public businessAreas: string;

  public valueRange;

  public form: FormGroup;
  public salaryExpectations: FormGroupName;

  public desiredIndustryBranches: FormArray;
  public preferredWorkingHours: FormArray;
  public desiredPlacesOfWork: FormArray;
  public preferredBusinessAreas: FormArray;

  constructor(
    public profileService: ProfileService,
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      searchPreferences: this.fb.group({
        salaryExpectations: this.fb.group({
          min: [0],
          max: [50]
        }),
        desiredIndustryBranches: this.fb.array([]),
        preferredWorkingHours: this.fb.array([]),
        preferredBusinessAreas: this.fb.array([]),
        desiredPlacesOfWork: this.fb.array([
          this.fb.group({
            city: [''],
            country: ['']
          })
        ])
      })
    });

    this.valueRange = this.form.get('searchPreferences').get('salaryExpectations').get('max').value;

    this.desiredIndustryBranches = this.form.get('searchPreferences').get('desiredIndustryBranches') as FormArray;
    this.desiredPlacesOfWork = this.form.get('searchPreferences').get('desiredPlacesOfWork') as FormArray;
    this.preferredWorkingHours = this.form.get('searchPreferences').get('preferredWorkingHours') as FormArray;
    this.preferredBusinessAreas = this.form.get('searchPreferences').get('preferredBusinessAreas') as FormArray;
  }

  ngOnInit(): void {
    this.init();
  }

  rangeValue = (value) => {
    this.valueRange = value.value;
  }


  saveData(formArrayName: string, field: string) {
    if (field && field.length) {
      this[formArrayName].push(this.fb.control(field));
    } else {
      return false;
    }
  }

  rangeChange() {
    console.log('rangeChange', this.form.value);
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
      .subscribe(res => {
        console.log('res', res);
      });
  }
}
