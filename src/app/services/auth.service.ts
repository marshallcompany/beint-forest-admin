import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  constructor() {}

  public saveJwtToken(token)  {
    sessionStorage.setItem('JWT', token);
  }

  public getJwtToken() {
    return sessionStorage.getItem('JWT');
  }
}
