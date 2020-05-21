import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormValidators } from 'src/app/validators/validators';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { MatDialog } from '@angular/material';

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
    public matDialog: MatDialog
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
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
}
