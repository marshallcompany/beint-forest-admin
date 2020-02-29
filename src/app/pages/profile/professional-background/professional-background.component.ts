import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-professional-background',
  templateUrl: './professional-background.component.html',
  styleUrls: ['./professional-background.component.scss']
})
export class ProfessionalBackgroundComponent implements OnInit {
  public accordionsStatus: boolean;
  @ViewChild('accordion01', { static: false }) accordion01;
  @ViewChild('accordion02', { static: false }) accordion02;
  @ViewChild('accordion03', { static: false }) accordion03;
  public works = [
    {
      field1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      select1: 'Teilzeit',
      checkbox: true,
      von: '2010-11-11T22:00:00.000Z',
      bis: '2012-11-11T22:00:00.000Z',
      ort: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      branch: 'Branche',
      jobTitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      area: 'Geschäftebereich',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    },
    {
      field1: 'Lorem ipsum dolor sit.',
      select1: 'Teilzeit',
      checkbox: false,
      von: '2009-11-11T22:00:00.000Z',
      bis: '2015-11-11T22:00:00.000Z',
      ort: 'Lorem ipsum dolor sit.',
      branch: 'Branche',
      jobTitle: 'Lorem ipsum dolor sit.',
      area: 'Geschäftebereich',
      description: 'Lorem ipsum dolor sit.'
    }
  ];

  public freelancing = [
    {
      field1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      field2: 'AAAAAAAAAAAAAAAAAa',
      checkbox: true,
      von: '2010-11-11T22:00:00.000Z',
      bis: '2008-11-11T22:00:00.000Z',
      ort: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      branch: 'Branche',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    },
  ];
  public other = [
    {
      field1: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      von: '2006-11-11T22:00:00.000Z',
      bis: '2005-11-11T22:00:00.000Z',
      ort: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
    },
  ];

  public navSettings = {
    iconCategory: '../assets/image/profile/category-03.svg',
    nameCategory: 'Beruflicher Werdegang',
    nextCategory: 'search-settings'
  };

  public form: FormGroup;
  public formWorkArray: FormArray;
  public formFreelanceArray: FormArray;
  public formOtherArray: FormArray;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.accordionsStatus = false;
  }

  ngOnInit(): void {
    this.init();
    this.formInit();
  }

  public init = () => {
    this.profileService.getProfile()
      .pipe()
      .subscribe(
        profileData => {
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

  public formInit = () => {
    this.form = this.fb.group({
      formWorkArray: this.fb.array([]),
      formFreelanceArray: this.fb.array([]),
      formOtherArray: this.fb.array([])

    });
    this.setFormGroup();
  }


  public accordionChange = () => {
    if (!this.accordion01.expanded && !this.accordion02.expanded && !this.accordion03.expanded) {
      this.accordionsStatus = false;
    }
  }

  public createFormGroup = (data: any, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'work':
        return this.fb.group({
          field1: [data.field1 ? data.field1 : ''],
          select1: [data.select1 ? data.select1 : 'Vollzeit'],
          checkbox: [data.checkbox ? data.checkbox : false],
          von: [data.von ? data.von : ''],
          bis: [data.bis ? data.bis : ''],
          ort: [data.ort ? data.ort : ''],
          branch: [data.branch ? data.branch : 'Branche'],
          jobTitle: [data.jobTitle ? data.jobTitle : ''],
          area: [data.area ? data.area : 'Geschäftebereich'],
          description: [data.description ? data.description : '']
        });
      case 'freelancing':
        return this.fb.group({
          field1: [data.field1 ? data.field1 : ''],
          field2: [data.field2 ? data.field2 : ''],
          checkbox: [data.checkbox ? data.checkbox : false],
          von: [data.von ? data.von : ''],
          bis: [data.bis ? data.bis : ''],
          ort: [data.ort ? data.ort : ''],
          branch: [data.branch ? data.branch : 'Branche'],
          description: [data.description ? data.description : '']
        });
      case 'other':
        return this.fb.group({
          field1: [data.field1 ? data.field1 : ''],
          von: [data.von ? data.von : ''],
          bis: [data.bis ? data.bis : ''],
          ort: [data.ort ? data.ort : ''],
          description: [data.description ? data.description : '']
        });
      default:
        break;
    }
  }

  public remove = (nameGroup, xx, i) => {
    this[nameGroup].removeAt(i);
    if (this[nameGroup].controls.length < 1) {
      this[nameGroup].push(this.createFormGroup({}, xx));
    }
  }


  public setFormGroup = (status?: string) => {

    this.formWorkArray = this.form.get('formWorkArray') as FormArray;
    this.formFreelanceArray = this.form.get('formFreelanceArray') as FormArray;
    this.formOtherArray = this.form.get('formOtherArray') as FormArray;

    if (!status) {
      this.works.forEach(work => {
        this.formWorkArray.push(this.createFormGroup(work, 'work'));
      });
      this.freelancing.forEach(freelancing => {
        this.formFreelanceArray.push(this.createFormGroup(freelancing, 'freelancing'));
      });
      this.other.forEach(other => {
        this.formOtherArray.push(this.createFormGroup(other, 'other'));
      });
    } else if (status === 'newWorkFields') {
      this.formWorkArray.push(this.createFormGroup({}, 'work'));
    } else if (status === 'newFreelanceFields') {
      this.formFreelanceArray.push(this.createFormGroup({}, 'freelancing'));
    } else if (status === 'newOtherFields') {
      this.formOtherArray.push(this.createFormGroup({}, 'other'));
    }
  }
}
