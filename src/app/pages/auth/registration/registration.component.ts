import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormValidators } from 'src/app/validators/validators';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public form: FormGroup;

  public privacyPolicy = new FormControl(false);
  public passwordShow = true;
  public confirmPasswordShow = true;
  public lastStep = false;

  constructor(
    public fb: FormBuilder,
    public matDialog: MatDialog,
    private auth: AuthService,
    private globalErrorService: GlobalErrorService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      accountType: ['user'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      placeOfResidence: ['', Validators.required],
      gender: [null, Validators.required]
    }, this.initFormValidation());
  }

  ngOnInit() {
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
  public openPrivacyDialog = () => {
    this.matDialog.open(PrivacyPolicyComponent, { panelClass: 'privacy-policy-dialog' });
  }

  public onChangeState = () => {
    this.lastStep = !this.lastStep;
  }

  public submit = () => {
    const registrationData = {
      email: this.form.get('email').value,
      password: this.form.get('password').value,
      accountType: this.form.get('accountType').value,
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      placeOfResidence: this.form.get('placeOfResidence').value,
      gender: this.form.get('gender').value,
    };
    this.auth.registration(registrationData)
    .pipe()
    .subscribe(
      res => {
        console.log('registration done', res);
      },
      error => {
        this.globalErrorService.handleError(error);
      }
    );
  }
}
