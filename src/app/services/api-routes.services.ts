import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiRoutesProvider {

  public readonly BASE_API_URL: string;
  public readonly GET_LOCAL_BUNDLE: string;
  public readonly GET_SKILLS: string;
  public readonly GET_BENEFITS_SCHEMA: string;
  public readonly CREATE_COMPANY: string;
  public readonly GET_COMPANY: string;
  public readonly UPDATE_COMPANY: string;
  public readonly GET_LINK_S3_COMPANY: string;
  public readonly GET_BUSINESS_SCHEMA: string;
  public readonly GET_EDUCATION_SCHEMA: string;
  public readonly GET_LANG_SCHEMA: string;
  public readonly GET_SPECIALIZATION_SCHEMA: string;
  public readonly GET_LANG: string;
  constructor() {
    this.BASE_API_URL = environment.BASE_API_URL;
    this.GET_LANG = `${this.BASE_API_URL}/api/v1/i18n/system-messages`;
    // OPTIONS
    this.GET_SKILLS = `${this.BASE_API_URL}/api/v1/skills/:lang`;
    this.GET_BENEFITS_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/benefits/:lang`;
    this.GET_LOCAL_BUNDLE = `${this.BASE_API_URL}/api/v1/i18n/locale-bundle/:lang`;
    this.GET_BUSINESS_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/businessBranches/:lang`;
    this.GET_EDUCATION_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/professionalEducation/:lang`;
    this.GET_LANG_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/languages/:lang`;
    this.GET_SPECIALIZATION_SCHEMA = `${this.BASE_API_URL}/api/v1/schema/universitySpecialization/:lang`;
    // COMPANY
    this.CREATE_COMPANY = `${this.BASE_API_URL}/api/v1/company/forest`;
    this.GET_COMPANY = `${this.BASE_API_URL}/api/v1/company/forest/:id`;
    this.UPDATE_COMPANY = `${this.BASE_API_URL}/api/v1/company/forest/:id`;
    this.GET_LINK_S3_COMPANY = `${this.BASE_API_URL}/api/v1/company/forest/upload-link`;
  }
}
