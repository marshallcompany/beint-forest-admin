import {Injectable} from '@angular/core';

import {environment} from '../../environments/environment';

@Injectable()
export class ApiRoutesProvider {

  public readonly BASE_API_URL: string;
  public readonly LOGIN: string;
  public readonly PROFILE: string;
  public readonly JOB_VACANCIES: string;
  public readonly GET_JOB_DATA: string;
  public readonly GET_CANDIDATE_CV: string;
  public readonly GET_LANG: string;
  public readonly GET_QUESTION: string;
  public readonly GET_LOCAL_BUNDLE: string;
  public readonly GET_BUSINESS_SCHEMA: string;
  public readonly GET_INDUSTRY_SCHEMA: string;
  public readonly GET_BENEFITS_SCHEMA: string;
  public readonly GET_TOWNS_SCHEMA: string;
  public readonly GET_COUNTRIES_SCHEMA: string;

  constructor() {
    this.BASE_API_URL = environment.BASE_API_URL;

    this.LOGIN = `${this.BASE_API_URL}/api/v1/auth/signin`;
    this.PROFILE = `${this.BASE_API_URL}/api/v1/profile/`;
    this.JOB_VACANCIES = `${this.BASE_API_URL}/api/v1/job-vacancy/:id/job-applications`;
    this.GET_JOB_DATA = `${this.BASE_API_URL}/api/v1/job-vacancy/:id`;
    this.GET_CANDIDATE_CV = `${this.BASE_API_URL}/api/v1/profile/pdf`;
    this.GET_LANG = `${this.BASE_API_URL}/api/v1/i18n/system-messages`;
    this.GET_QUESTION = `${this.BASE_API_URL}/api/v1/profile/questions`;
    this.GET_LOCAL_BUNDLE = `${this.BASE_API_URL}/api/v1/i18n/locale-bundle/:lang`;
    this.GET_BUSINESS_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/businessBranches/:lang`;
    this.GET_INDUSTRY_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/industryBranches/:lang`;
    this.GET_BENEFITS_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/benefits/:lang`;
    this.GET_TOWNS_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/towns/:lang`;
    this.GET_COUNTRIES_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/countries/:lang`;

  }
}
