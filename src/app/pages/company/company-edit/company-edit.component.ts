import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { of, throwError, Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ImageChoiceComponent } from 'src/app/components/sheet/image-choice/image-choice.component';
import { CropperComponent } from 'src/app/components/modal/cropper/cropper.component';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { OptionsService } from 'src/app/services/options.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  public data = {
    general: {
      companyName: 'companyName',
      legalForm: 'Bahncard ',
      street: 'street',
      houseNumber: 'houseNumber',
      additionalAddress: 'additionalAddress',
      location: 'location',
      country: 'country',
      place: 'place',
      zipCode: 'zipCode',
      countryCode: 'ccountry',
      cityCode: '2',
      contactPhone: '3',
      contactEmail: '4',
      homepage: '5',
      logo: '',
      benefits: ['Anbindung öffentlicher Nahverkehr', 'Betriebs-Kita', 'Barrierefreiheit']
    },
    offices: {
      name: '1',
      street: '1',
      houseNumber: '1',
      additionalAddress: '1',
      country: '1',
      place: '1',
      zipCode: '1',
      location: '1',
    },
    recruiters: [
      {
        salutation: null,
        title: '2',
        firstName: '2',
        lastName: '2',
        jobTitle: '2',
        countryCode: '2',
        cityCode: '2',
        phoneNumberMobile: '2',
        email: '2'
      },
      {
        salutation: null,
        title: '3',
        firstName: '3',
        lastName: '3',
        jobTitle: '3',
        countryCode: '3',
        cityCode: '3',
        phoneNumberMobile: '3',
        email: '3'
      }
    ],
    filials: [
      {
        name: '4',
        street: '4',
        houseNumber: '4',
        additionalAddress: '4',
        country: '4',
        place: '4',
        location: '4',
        zipCode: '4'
      }
    ]
  };
  public benefitsOptions$: Observable<any>;

  public form: FormGroup;
  public generalBenefitsControl = new FormControl();
  public generalFormGroup: FormGroup;
  public officesFormGroup: FormGroup;


  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog,
    private globalErrorService: GlobalErrorService,
    private optionsService: OptionsService
  ) {
    console.log('[ GET URL PARAMS ]', this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.formInit();
    this.init();
  }


  public init = () => {
    const dropdownOptions$ = this.optionsService.getLocalBundle('de');
    this.benefitsOptions$ = this.optionsService.getBenefitsOptions('de', '');
    forkJoin([dropdownOptions$])
      .pipe(
        map(([dropdownOptions]) => {
          if (dropdownOptions && dropdownOptions.dropdownOptions) {
            return {
              dropdownOptions: dropdownOptions.dropdownOptions
            };
          }
        })
      )
      .subscribe(
        result => {
          console.log('[ INIT ]', result);
          this.patchFormValue(this.data);
        },
        error => {
          console.log('[ INIT ERROR ]', error);
        }
      );
  }

  public formInit = () => {
    this.form = this.fb.group({
      general: this.fb.group({
        companyName: [''],
        legalForm: [null],
        street: [''],
        houseNumber: [''],
        additionalAddress: [''],
        location: [''],
        country: [''],
        place: [''],
        zipCode: [''],
        countryCode: [''],
        cityCode: [''],
        contactPhone: [''],
        contactEmail: [''],
        homepage: [''],
        logo: [''],
        benefits: this.fb.array([])
      }),
      recruiters: this.fb.array([]),
      offices: this.fb.group({
        name: [''],
        street: [''],
        houseNumber: [''],
        additionalAddress: [''],
        country: [''],
        place: [''],
        zipCode: [''],
        location: [''],
      }),
      filials: this.fb.array([])
    });
    if (this.form) {
      this.generalFormGroup = this.form.get('general') as FormGroup;
      this.officesFormGroup = this.form.get('offices') as FormGroup;
      this.filialsArray.push(this.createFormGroup({}, 'filials'));
      this.recruitersArray.push(this.createFormGroup({}, 'recruiter'));
      this.form.valueChanges
        .pipe()
        .subscribe(
          () => {
            this.generalBenefitsControl.patchValue(this.generalBenefitsArray.value.length !== 0 ? this.generalBenefitsArray.value : ['']);
          }
        );
    }
  }

  public get generalBenefitsArray(): FormArray {
    return this.form.get('general').get('benefits') as FormArray;
  }

  public get filialsArray(): FormArray {
    return this.form.get('filials') as FormArray;
  }

  public get recruitersArray(): FormArray {
    return this.form.get('recruiters') as FormArray;
  }

  public newFormGroup = (formArrayName: FormArray, formGroupName: string) => {
    formArrayName.push(this.createFormGroup({}, formGroupName));
  }

  public deleteFormGroup = (formArray: FormArray, index: number, formGroupName: string) => {
    if (formArray.controls.length < 2) {
      formArray.removeAt(index);
      formArray.push(this.createFormGroup({}, formGroupName));
    } else {
      formArray.removeAt(index);
    }
  }

  public patchFormValue = (data) => {
    this.form.patchValue({
      general: {
        companyName: data && data.general && data.general.companyName ? data.general.companyName : '',
        legalForm: data && data.general && data.general.legalForm ? data.general.legalForm : null,
        street: data && data.general && data.general.street ? data.general.street : '',
        houseNumber: data && data.general && data.general.houseNumber ? data.general.houseNumber : '',
        additionalAddress: data && data.general && data.general.additionalAddress ? data.general.additionalAddress : '',
        location: data && data.general && data.general.location ? data.general.location : '',
        country: data && data.general && data.general.country ? data.general.country : '',
        place: data && data.general && data.general.place ? data.general.place : '',
        zipCode: data && data.general && data.general.zipCode ? data.general.zipCode : '',
        countryCode: data && data.general && data.general.countryCode ? data.general.countryCode : '',
        cityCode: data && data.general && data.general.cityCode ? data.general.cityCode : '',
        contactPhone: data && data.general && data.general.contactPhone ? data.general.contactPhone : '',
        contactEmail: data && data.general && data.general.contactEmail ? data.general.contactEmail : '',
        homepage: data && data.general && data.general.homepage ? data.general.homepage : '',
        logo: data && data.general && data.general.logo ? data.general.logo : '',
      },
      offices: {
        name: data && data.offices && data.offices.name ? data.offices.name : '',
        street: data && data.offices && data.offices.street ? data.offices.street : '',
        houseNumber: data && data.offices && data.offices.houseNumber ? data.offices.houseNumber : '',
        additionalAddress: data && data.offices && data.offices.additionalAddress ? data.offices.additionalAddress : '',
        country: data && data.offices && data.offices.country ? data.offices.country : '',
        place: data && data.offices && data.offices.place ? data.offices.place : '',
        zipCode: data && data.offices && data.offices.zipCode ? data.offices.zipCode : '',
        location: data && data.offices && data.offices.location ? data.offices.location : '',
      }
    });
    if (data && data.general && data.general.benefits) {
      data.general.benefits.forEach(element => {
        this.generalBenefitsArray.push(this.fb.control(element));
      });
    }
    if (data && data.recruiters.length) {
      this.recruitersArray.removeAt(0);
      data.recruiters.forEach(element => {
        this.recruitersArray.push(this.createFormGroup(element, 'recruiter'));
      });
    }
    if (data && data.filials.length) {
      this.filialsArray.removeAt(0);
      data.filials.forEach(element => {
        this.filialsArray.push(this.createFormGroup(element, 'filials'));
      });
    }
  }

  public createFormGroup = (data, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'recruiter':
        return this.fb.group({
          salutation: [data && data.salutation ? data.salutation : null],
          title: [data && data.title ? data.title : ''],
          firstName: [data && data.firstName ? data.firstName : ''],
          lastName: [data && data.lastName ? data.lastName : ''],
          jobTitle: [data && data.jobTitle ? data.jobTitle : ''],
          countryCode: [data && data.countryCode ? data.countryCode : ''],
          cityCode: [data && data.cityCode ? data.cityCode : ''],
          phoneNumberMobile: [data && data.phoneNumberMobile ? data.phoneNumberMobile : ''],
          email: [data && data.email ? data.email : '']
        });
      case 'filials':
        return this.fb.group({
          name: [data && data.name ? data.name : ''],
          street: [data && data.street ? data.street : ''],
          houseNumber: [data && data.houseNumber ? data.houseNumber : ''],
          additionalAddress: [data && data.additionalAddress ? data.additionalAddress : ''],
          country: [data && data.country ? data.country : ''],
          place: [data && data.place ? data.place : ''],
          location: [data && data.location ? data.location : ''],
          zipCode: [data && data.zipCode ? data.zipCode : '']
        });
      default:
        break;
    }
  }
  public takeProfilePicture = () => {
    this.bottomSheet.open(ImageChoiceComponent, { scrollStrategy: new NoopScrollStrategy() }).afterDismissed()
      .pipe(
        switchMap(selectedFile => {
          if (!selectedFile || selectedFile === undefined) {
            return throwError('NO_FILE');
          }
          if (selectedFile.target.files[0] && selectedFile.target.files[0].size > 5000000) {
            return throwError(new Error('Sorry, the maximum file size is 5MB'));
          }
          return of(selectedFile);
        }),
        switchMap(targetFile => {
          return this.openCropperDialog(targetFile);
        }),
        switchMap(cropperValue => {
          if (!cropperValue || cropperValue === undefined) {
            return throwError('CROPPER_CLOSED');
          }
          return of(cropperValue);
        }),
        switchMap((base64: string) => {
          this.form.get('general').get('logo').patchValue(base64);
          return of(base64);
          // return fetch(base64).then(base64Url => base64Url.blob());
        })
      )
      .subscribe(
        res => {
          console.log('CROPPER EVENT', res);
        },
        err => {
          console.log('ERROR', err);
          if (err === 'NO_FILE' || err === 'CROPPER_CLOSED') {
            return;
          } else {
            this.globalErrorService.handleError(err);
          }
        }
      );
  }

  openCropperDialog(fileData): Observable<any> {
    return this.matDialog.open(CropperComponent, { data: fileData, panelClass: 'cropper-modal', scrollStrategy: new NoopScrollStrategy() }).afterClosed();
  }

  public googleAddressChange = (data, formGroup: FormGroup, fields: Array<string>) => {
    of(data)
      .pipe(
        switchMap(value => {
          if (value === '[NO VALUE]') {
            this.cleaningFormControl(formGroup, fields);
            return throwError('[NO VALUE]');
          }
          return of(value);
        }),
        switchMap(googleAddress => {
          if (!googleAddress.city) {
            return throwError('[NO CITY]');
          }
          if (!googleAddress.zipCode) {
            return throwError('[NO POSTAL CODE]');
          }
          return of(
            {
              place: googleAddress.city,
              country: googleAddress.country,
              zipCode: googleAddress.zipCode,
              location: googleAddress.value
            }
          );
        })
      )
      .subscribe(
        result => {
          console.log('RESULT', result);
          this.updateFormControl(formGroup, fields, result);
        },
        error => {
          if (error === '[NO POSTAL CODE]') {
            this.notificationService.notify('Standortinformationen unvollständig, fehlende Postleitzahl');
          }
          if (error === '[NO CITY]') {
            this.notificationService.notify('Standortinformationen unvollständig, fehlende Stadt');
          }
          console.log('[ GOOGLE ADDRESS ERROR ]', error);
        }
      );
  }

  public cleaningFormControl = (formGroup: FormGroup, fields: Array<string>) => {
    fields.forEach(item => {
      formGroup.get(item).setValue('');
    });
  }

  public updateFormControl = (formGroup: FormGroup, fields: Array<string>, value) => {
    fields.forEach(item => {
      formGroup.get(item).setValue(value[item]);
    });
  }

  public formArrayPush = (value, formArrayName) => {
    if (value && formArrayName) {
      this[formArrayName].push(this.fb.control(value.slice(-1)[0]));
    } else {
      return false;
    }
  }

  public formArrayRemove = (index, formArrayName) => {
    if (index && formArrayName) {
      this[formArrayName].removeAt(index);
    } else if (index === 0) {
      this[formArrayName].removeAt();
    }
  }

  public onlyNumber = (event: any, addition?: boolean) => {
    const pattern = /[0-9]/;
    const patternPlus = /[0-9\+]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!addition && event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (addition && event.keyCode !== 8 && !patternPlus.test(inputChar)) {
      event.preventDefault();
    }
  }
  public submit = () => {
    let formValue: object;
    formValue = {
      company: {
        companyName: this.form.get('general').get('companyName').value,
        legalForm: this.form.get('general').get('legalForm').value,
        street: this.form.get('general').get('street').value,
        houseNumber: this.form.get('general').get('houseNumber').value,
        additionalAddress: this.form.get('general').get('additionalAddress').value,
        zipCode: this.form.get('general').get('zipCode').value,
        place: this.form.get('general').get('place').value,
        country: this.form.get('general').get('country').value,
        countryCode: this.form.get('general').get('countryCode').value,
        cityCode: this.form.get('general').get('cityCode').value,
        contactPhone: this.form.get('general').get('contactPhone').value,
        contactEmail: this.form.get('general').get('contactEmail').value,
        homepage: this.form.get('general').get('homepage').value,
        logo: this.form.get('general').get('logo').value,
        benefits: this.form.get('general').get('benefits').value,
        fillials: this.filialsArray.value,
        offices: this.form.get('offices').value
      },
      recruiters: this.recruitersArray.value
    };
    console.log('submit', formValue);
  }

}
