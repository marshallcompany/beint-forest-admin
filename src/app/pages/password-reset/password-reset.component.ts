import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormValidators } from 'src/app/validators/validators';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  public resetViaPasswordForm: FormGroup;
  constructor(
    public fb: FormBuilder
  ) {
    this.resetViaPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required, FormValidators.matchingPasswords]]
    }, this.initFormValidation());
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
    console.log('reset', this.resetViaPasswordForm);
  }
}
