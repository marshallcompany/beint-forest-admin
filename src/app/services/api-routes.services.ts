import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutesProvider {

  public readonly BASE_API_URL: string;
  public readonly LOGIN: string;
  public readonly PROFILE: string;
  public readonly JOB_VACANCIES: string;

  constructor() {
    this.BASE_API_URL = environment.BASE_API_URL;

    this.LOGIN = `${this.BASE_API_URL}/api/v1/auth/signin`;
    this.PROFILE = `${this.BASE_API_URL}/api/v1/profile/`;
    this.JOB_VACANCIES = `${this.BASE_API_URL}/api/v1/job-vacancy/:id/job-applications`;
  }
}
