import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { FormValidators } from '../../validators/validators';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application-service';
import { GlobalErrorService } from 'src/app/services/global-error-service';


@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  @Input() titleStatus: boolean;
  @Output() loginChanges = new EventEmitter();

  public validationError: any;
  public showPass: boolean;
  public incorrectCredentials: boolean;
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private auth: AuthService,
    private applicationService: ApplicationService,
    private globalErrorService: GlobalErrorService
  ) {
    this.showPass = false;
    this.incorrectCredentials = false;
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
      this.loginChanges.emit();
      if (this.applicationService.getJobId() || this.router.routerState.snapshot.url.includes('/apply')) {
        this.router.navigate([this.router.routerState.snapshot.url]);
      } else {
        this.router.navigate(['/profile']);
      }

    } catch (error) {
      console.log('error', error);
      if (error.status === 401 && error.error.message === 'CREDENTIALS_NOT_VALID') {
        this.incorrectCredentials = true;
      } else {
        this.globalErrorService.handleError(error);
      }
    }
  }

  public hideCredentialsError = () => {
    if (this.incorrectCredentials) {
      this.incorrectCredentials = false;
    }
    return;
  }

  public triggerValidation(field: string) {
    if (this.form.get(field).value.length !== 0) {
      this.validationError[field] = true;
    }
  }

}
