import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { of, throwError, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ImageChoiceComponent } from 'src/app/components/sheet/image-choice/image-choice.component';
import { CropperComponent } from 'src/app/components/modal/cropper/cropper.component';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.scss']
})
export class CompanyCreateComponent implements OnInit {

  public dropdownOptions = ['1', '2', '3', '4', '5'];

  public form: FormGroup;
  public generalBenefitsControl = new FormControl();
  public generalFormGroup;

  constructor(
    public fb: FormBuilder,
    private notificationService: NotificationService,
    private bottomSheet: MatBottomSheet,
    private matDialog: MatDialog,
    private globalErrorService: GlobalErrorService
  ) { }

  ngOnInit() {
    this.formInit();
  }

  public formInit = () => {
    this.form = this.fb.group({
      general: this.fb.group({
        a1: [''],
        a2: [null],
        a3: [''],
        a4: [''],
        a5: [''],
        location: [''],
        country: [''],
        place: [''],
        zipCode: [''],
        a9: [''],
        a10: [''],
        a11: [''],
        a12: [''],
        a13: [''],
        logo: [''],
        benefits: this.fb.array([])
      }),
      recruiter: this.fb.group({
        a1: [],
        a2: [],
        a3: [],
        a4: [],
        a5: [],
        a6: [],
        a7: [],
        a8: [],
        a9: [],
      })
    });
    if (this.form) {
      this.form.valueChanges
        .pipe()
        .subscribe(
          () => {
            this.generalBenefitsControl.patchValue(this.generalBenefitsArray.value.length !== 0 ? this.generalBenefitsArray.value : ['']);
          }
        );
    }
    this.generalFormGroup = this.form.get('general') as FormGroup;
  }

  public get generalBenefitsArray(): FormArray {
    return this.form.get('general').get('benefits') as FormArray;
  }

  public takeProfilePicture = () => {
    this.bottomSheet.open(ImageChoiceComponent, { scrollStrategy: new NoopScrollStrategy()}).afterDismissed()
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

    if (!addition &&  event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (addition && event.keyCode !== 8 && !patternPlus.test(inputChar)) {
      event.preventDefault();
    }
  }
  public submit = () => {
    console.log('submit', this.form.value);
  }
}
