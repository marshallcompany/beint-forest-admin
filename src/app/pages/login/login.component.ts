import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Router} from "@angular/router"

import { FormValidators } from '../../validators/validators'
import { AuthProvider } from '../../providers/auth/auth'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public showPass: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private auth: AuthProvider
  ) {
    this.showPass = false;
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
  }

  public submit = () => {
    this.auth.login(this.form.value)
      .pipe()
      .subscribe(
        res => {
          this.router.navigate(['/personal-data']);
          alert('Successfully');
        },
        err => {
          console.log('[ ERROR LOGIN ]', err);
          alert('Is no such user');
        },
        () => console.log('[ LOGIN DONE ]')
      )
  }

  public showPassword = () => {
    this.showPass = !this.showPass;
  }

  public inputStatus = (name, element) => {
    this.form.get(name).statusChanges
    .pipe()
    .subscribe(
      res => {
        if (res === 'INVALID') {
          element.classList.add('input-invalid');
        } else {
          element.classList.remove('input-invalid');
          element.classList.add('input-valid');
        }
      }
    )
  }
}
