import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public stateReset = {
    email: false,
    password: false
  };

  constructor() { }

  ngOnInit() { }

  public stateChanges = (value: object) => {
    const key = Object.keys(value)[0];
    this.stateReset[key] = value[key];
  }
}
