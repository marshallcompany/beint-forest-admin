import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { of, throwError, Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ImageChoiceComponent } from 'src/app/components/sheet/image-choice/image-choice.component';
import { CropperComponent } from 'src/app/components/modal/cropper/cropper.component';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { OptionsService } from 'src/app/services/options.service';
import { FormValidators } from 'src/app/validators/validators';
import { CompanyService } from 'src/app/services/company.service';

interface DropdownOption {
  salutation: Array<string[]>;
  legal_forms: Array<string[]>;
}

@Component({
  selector: 'app-job-summary-edit',
  templateUrl: './job-summary-edit.component.html',
  styleUrls: ['./job-summary-edit.component.scss']
})
export class JobSummaryEditComponent implements OnInit {

  public benefitsOptions$: Observable<any>;
  public dropdownOptions: DropdownOption;

  public form: FormGroup;
  public generalBenefitsControl = new FormControl();
  public generalFormGroup: FormGroup;
  public spinner = false;
  constructor(
    public fb: FormBuilder,
    public companyService: CompanyService,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog,
    private globalErrorService: GlobalErrorService,
    private optionsService: OptionsService,
  ) { }

  ngOnInit() {
    this.init();
    this.formInit();
  }

  public init = () => {
    const dropdownOptions$ = this.optionsService.getLocalBundle('de');
    this.benefitsOptions$ = this.optionsService.getBenefitsOptions('de', '');
    forkJoin([dropdownOptions$])
    .pipe(
      map(([dropdownOptions]) => {
        if (dropdownOptions && dropdownOptions.dropdownOptions) {
          return {
            dropdownOptions: {
              legal_forms: dropdownOptions.dropdownOptions.legal_forms,
              salutation: dropdownOptions.dropdownOptions.salutation
            }
          };
        }
      })
    )
    .subscribe(
      (result: any) => {
        console.log('[ INIT ]', result);
        this.dropdownOptions = result.dropdownOptions;
      },
      error => {
        console.log('[ INIT ERROR ]', error);
      }
    );
  }

  public formInit = () => {
    this.form = this.fb.group({
      general: this.fb.group({
        companyName: ['', Validators.required],
        legalForm: [null, Validators.required],
        street: ['', Validators.required],
        houseNumber: ['', Validators.required],
        additionalAddress: ['', Validators.required],
        location: ['', Validators.required],
        country: ['', Validators.required],
        place: ['', Validators.required],
        zipCode: ['', Validators.required],
        countryCode: ['', Validators.required],
        cityCode: ['', Validators.required],
        contactPhone: ['', Validators.required],
        contactEmail: ['', [Validators.required, FormValidators.emailValidator]],
        homepage: ['', Validators.required],
        logo: [''],
        benefits: this.fb.array([], Validators.required)
      }),
      recruiters: this.fb.array([]),
      offices: this.fb.array([]),
      fillials: this.fb.array([])
    });
    if (this.form) {
      this.generalFormGroup = this.form.get('general') as FormGroup;
      this.fillialsArray.push(this.createFormGroup({}, 'fillials'));
      this.officesArray.push(this.createFormGroup({}, 'offices'));
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

  public get fillialsArray(): FormArray {
    return this.form.get('fillials') as FormArray;
  }

  public get officesArray(): FormArray {
    return this.form.get('offices') as FormArray;
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

  public createFormGroup = (data, nameGroup: string): FormGroup => {
    switch (nameGroup) {
      case 'recruiter':
        return this.fb.group({
          salutation: [data && data.salutation ? data.salutation : null, Validators.required],
          title: [data && data.title ? data.title : '', Validators.required],
          firstName: [data && data.firstName ? data.firstName : '', Validators.required],
          lastName: [data && data.lastName ? data.lastName : '', Validators.required],
          jobTitle: [data && data.jobTitle ? data.jobTitle : '', Validators.required],
          countryCode: [data && data.countryCode ? data.countryCode : '', Validators.required],
          cityCode: [data && data.cityCode ? data.cityCode : '', Validators.required],
          phoneNumberMobile: [data && data.phoneNumberMobile ? data.phoneNumberMobile : '', Validators.required],
          email: [data && data.email ? data.email : '', FormValidators.emailValidator]
        });
      case 'fillials':
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
      case 'offices':
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

    if (!addition &&  event.keyCode !== 8 && !pattern.test(inputChar)) {
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
        location: this.form.get('general').get('location').value,
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
        fillials: this.fillialsArray.value,
        offices: this.officesArray.value
      },
      recruiters: this.recruitersArray.value
    };
    console.log('SUBMIT', formValue);
    this.companyService.createCompany(formValue)
    .pipe()
    .subscribe(
      result => {
        console.log('[ CREATE COMPANY DONE ]', result);
        this.notificationService.notify('Änderungen erfolgreich gespeichert', 'success');
      },
      error => {
        console.log('[ CREATE COMPANY ERROR ]', error);
      }
    );
  }
}
