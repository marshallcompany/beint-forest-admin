import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/validators/validators';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  public resetViaPasswordForm: FormGroup;
  public resetViaEmailForm: FormGroup;
  public credentialsNotValid: boolean;
  public resetPasswordSuccessful: boolean;
  public oldPasswordShow = true;
  public newPasswordShow = true;
  public validationError: object;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    private location: Location
  ) {
    this.credentialsNotValid = false;
    this.validationError = {
      password: false,
      newPassword: false,
      confirmPassword: false
    };
    this.resetViaPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, this.initFormValidation());

    this.resetViaEmailForm = this.fb.group({
      email: ['', [Validators.required, FormValidators.emailValidator]]
    });

  }

  ngOnInit() {
  }

  public initFormValidation = () => {
    let formValidation: object;
    formValidation = {
      validator: FormValidators.matchingPasswords(
        'newPassword',
        'confirmPassword'
      )
    };

    return formValidation;
  }

  public resetViaPasswordSubmit = () => {
    const passwords = {
      currentPassword: this.resetViaPasswordForm.value.password,
      newPassword: this.resetViaPasswordForm.value.newPassword
    };
    this.authService.updateUserPassword(passwords)
      .pipe()
      .subscribe(
        res => {
          this.resetPasswordSuccessful = true;
        },
        error => {
          console.log('update password error', error);
          if (error.status === 400 && error.error.message === 'CREDENTIALS_NOT_VALID') {
            this.credentialsNotValid = true;
          }
        }
      );
  }

  public triggerValidation(field: string) {
    if (this.resetViaPasswordForm.get(field).value.length !== 0) {
      this.validationError[field] = true;
    }
  }

  public hideCredentialsError = () => {
    if (this.credentialsNotValid) {
      this.credentialsNotValid = false;
    }
    return;
  }

  public showPassword = (value) => {
    switch (value) {
      case 'oldPasswordShow':
        this.oldPasswordShow = !this.oldPasswordShow;
        break;
      case 'newPasswordShow':
        this.newPasswordShow = !this.newPasswordShow;
        break;
      default:
        break;
    }
  }

  public backRoute = () => {
    this.location.back();
  }
  onResize(event) {
    if (event.target.innerWidth >= 768) {
      this.location.back();
    }
  }
}
