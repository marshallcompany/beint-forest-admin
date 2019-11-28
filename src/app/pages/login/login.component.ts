import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormValidators } from '../../validators/validators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, FormValidators.emailValidator]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  public submit = (event) => {
    console.log('[ EVENT ]', event);
  }

}
