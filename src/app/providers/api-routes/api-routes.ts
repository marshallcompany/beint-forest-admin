import { Injectable } from '@angular/core';

import { ENV } from '../../env/env';

@Injectable()
export class ApiRoutesProvider {

    public readonly LOGIN: string;
    public readonly JOB_VACANCIES: string;
    public readonly BASE_API_URL: string;

    constructor() {
        this.LOGIN = '/api/v1/auth/signin';
        this.BASE_API_URL = ENV.BASE_API_URL
        this.JOB_VACANCIES = '/api/v1/job-vacancy/:id/job-applications';
    }
}