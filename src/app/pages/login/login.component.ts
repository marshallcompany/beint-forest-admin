import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { FormValidators } from '../../validators/validators';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public validationError: object;
  public showPass: boolean;
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private auth: AuthService,
    private applicationService: ApplicationService
  ) {
    this.showPass = false;
    this.validationError = {
      email: false,
      password: false
    };
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() { }

  public showPassword = () => {
    this.showPass = !this.showPass;
  }

  public async submit() {
    try {
      await this.auth.login(this.form.value);

      if (this.applicationService.getJobId()) {
        this.router.navigate(['/application']);
      } else {
        this.router.navigate(['/profile']);
      }

    } catch (error) {
      console.log('error', error);
      alert(`Oops! Something went wrong. Please try again later.`);
    }
  }

  public triggerValidation(field: string) {
    if (this.form.get(field).value.length !== 0) {
      this.validationError[field] = true;
    }
  }

}
