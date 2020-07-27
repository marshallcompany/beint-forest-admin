import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormValidators } from 'src/app/validators/validators';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public form: FormGroup;
  public validationError = {
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    placeOfResidence: false
  };
  public passwordShow = true;
  public confirmPasswordShow = true;
  public registrationStatus = false;
  public lastStep = false;

  landList$: Observable<string[]>;

  public cityArray = [];

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public matDialog: MatDialog,
    private auth: AuthService,
    private globalErrorService: GlobalErrorService,
    private searchService: SearchService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      accountType: ['user'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      placeOfResidence: [null, Validators.required],
      dateBirth: [null, Validators.required],
      country: [null, Validators.required]
      // gender: [null, Validators.required]
    }, this.initFormValidation());
  }

  ngOnInit() {
    this.landList$ = this.searchService.getCountries('de', '');
  }

  public initFormValidation = () => {
    let formValidation: object;
    formValidation = {
      validator: FormValidators.matchingPasswords(
        'password',
        'confirmPassword'
      )
    };

    return formValidation;
  }

  public showPassword = (value) => {
    switch (value) {
      case 'password':
        this.passwordShow = !this.passwordShow;
        break;
      case 'confirmPassword':
        this.confirmPasswordShow = !this.confirmPasswordShow;
        break;
      default:
        break;
    }
  }

  public selectionResidence = (event, formControl: FormControl) => {
    this.searchService.getTowns('de', '', event)
      .pipe()
      .subscribe(
        res => {
          this.cityArray = res;
          if (formControl.value) {
            formControl.setValue(null);
          }
        }
      );
  }

  public onOpenPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

  public onChangeState = () => {
    this.lastStep = !this.lastStep;
    document.getElementsByTagName('app-auth')[0].scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  public triggerValidation(field: string) {
    if (this.form.get(field).value.length !== 0) {
      this.validationError[field] = true;
    }
  }

  public submit = () => {
    const registrationData = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      accountType: this.form.get('accountType').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      placeOfResidence: this.form.get('placeOfResidence').value,
      // gender: this.form.get('gender').value,
      dateBirth: this.form.get('dateBirth').value,
      country: this.form.get('country').value
    };
    this.auth.registration(registrationData)
    .pipe()
    .subscribe(
      res => {
        console.log('registration done', res);
        this.registrationStatus = true;
        document.getElementsByTagName('app-auth')[0].scrollIntoView({ block: 'start', behavior: 'smooth' });
        if (res.refreshToken && res.token) {
          this.auth.saveAuthData(res);
        }
      },
      error => {
        if (error.error.message === 'E-Mail address already taken') {
          this.globalErrorService.handleError(new Error('Es gibt bereits einen Nutzer mit dieser Emailadresse'));
          setTimeout(() => {
            this.onChangeState();
          }, 500);
        } else {
          this.globalErrorService.handleError(error);
        }
      }
    );
  }
  public onGoToRouter = (routerName: string) => {
    this.router.navigate([routerName]);
  }
}
