import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, FormGroupName, FormControl} from '@angular/forms';
import {ProfileService} from '../../../services/profile.service';
import {debounceTime, map, share} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SearchService} from '../../../services/search.service';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-professional-background',
  templateUrl: './professional-background.component.html',
  styleUrls: ['./professional-background.component.scss']
})
export class ProfessionalBackgroundComponent implements OnInit {
  public accordionsStatus: boolean;
  @ViewChild('accordion01', {static: false}) accordion01;
  @ViewChild('accordion02', {static: false}) accordion02;
  @ViewChild('accordion03', {static: false}) accordion03;

  public navSettings = {
    iconCategory: '../assets/image/profile/category-03.svg',
    nameCategory: 'Beruflicher Werdegang',
    nextCategory: 'search-settings'
  };

  public form: FormGroup;
  public workExperience: FormGroupName;
  public employmentConditions: FormGroupName;
  public businessArea = new FormControl();
  public independentBusinessAreaControl = new FormControl();
  public $countriesList: Observable<string[]>;
  currentDate = moment().toDate();
  previousDate = moment().add(-1, 'day').toDate();


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private searchService: SearchService
  ) {
    this.accordionsStatus = false;
  }

  ngOnInit(): void {
    this.init();
    this.formInit();
  }

  public init = () => {
    const profile$ = this.profileService.getProfile();
    forkJoin([profile$])
      .pipe(
        map(([profile]) => {
          if (profile && profile.profile && profile.profile.workExperience) {
            return {
              workExperience: profile.profile.workExperience
            };
          }
          return [profile];
        })
      )
      .subscribe((res: any) => {
        // this.patchFormValue(res.searchPreferences);
        console.log('res', res);
      });
  }

  public formInit = () => {
    this.form = this.fb.group({
      workExperience: this.fb.group({
        employmentConditions: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        }),
        independentExperience: this.fb.group({
          isNotRelevant: [false],
          items: this.fb.array([])
        })
      })
    });
    this.setFormGroup();
  };

  notRelevant(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateEnd').setValue(this.currentDate.toDateString());
    }
  }

  setTodayDate(group: FormGroup) {
    const isSet = group.get('tilToday').value;
    if (isSet) {
      group.get('dateEnd').setValue(this.currentDate.toDateString());
    }
  }

  public accordionChange = () => {
    if (!this.accordion01.expanded || !this.accordion02.expanded || !this.accordion03.expanded) {
      this.accordionsStatus = false;
    }
  };

  getCountryList(query: string) {
    this.$countriesList = this.searchService.getCountries('de', query).pipe(debounceTime(500), share());
  }

  public get employmentConditionsArray(): FormArray {
    return this.form.get('workExperience').get('employmentConditions').get('items') as FormArray;
  }
  public get independentExperienceArray(): FormArray {
    return this.form.get('workExperience').get('independentExperience').get('items') as FormArray;
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'employmentConditions':
        return this.fb.group({
          company: [''],
          dateStart: [],
          dateEnd: [],
          country: [],
          workPlace: [''],
          jobTitle: [''],
          careerLevel: [''],
          descriptions: [''],
          businessArea: this.fb.array([]),
          employmentType: [''],
          industryBranch: [''],
          jobDescription: [''],
          tilToday: [false]
        });
      case 'independentExperience':
        return this.fb.group({
          jobTitle: ['jobTitle'],
          companyName: ['companyName'],
          dateStart: [null],
          dateEnd: [null],
          country: [''],
          workPlace: [''],
          jobDescription: [''],
          isFreelancer: [false],
          businessArea: this.fb.array(['xxxx', 'wwwww']),
          tilToday: [false]
        });
      default:
        break;
    }
  }

  public remove = (nameArray, nameCategory, index) => {
    this[nameArray].removeAt(index);
    if (this[nameArray].value.length < 1) {
      this[nameArray].push(this.createFormGroup({}, nameCategory));
    }
  }

  public formArrayRemove = (index, formArrayName, field) => {
    console.log(this[formArrayName]);
    // if (index && formArrayName && field) {
    //   this[formArrayName].removeAt(index);
    //   this.submit(field);
    // } else if (index === 0) {
    //   this[formArrayName].removeAt();
    //   this.submit(field);
    // }
  }

  public setFormGroup = (status?: string) => {
    this.employmentConditionsArray.push(this.createFormGroup({}, 'employmentConditions'));
    this.independentExperienceArray.push(this.createFormGroup({}, 'independentExperience'));
  }

  public submit = (fieldName) => {
    console.log('submit', this.form.value);
  }
}
