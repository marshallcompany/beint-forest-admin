import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoutingModule } from './modules/routing.module';
import { ApiRoutesProvider } from './services/api-routes.services';

import { AuthService } from './services/auth.service';
import { DownloadFileService } from './services/download-file.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpMultiLoaderServiceService } from './services/http-multi-loader-service';
import { NotificationService } from './services/notification.service';
import { GlobalErrorService } from './services/global-error-service';

import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HammerConfig } from './hammerjs/hammer-config';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonalComponent } from './pages/profile/personal/personal.component';
import { EducationComponent } from './pages/profile/education/education.component';
import { ProfileCategoryItemComponent } from './components/profile-category-item/profile-category-item.component';
import { CategoryNavHeaderComponent } from './components/category-nav-header/category-nav-header.component';
import { AboutComponent } from './pages/profile/about/about.component';
import { SearchSettingsComponent } from './pages/profile/search-settings/search-settings.component';
import { ProfessionalBackgroundComponent } from './pages/profile/professional-background/professional-background.component';
import { ConfirmModalComponent } from './components/modal/confirm/confirm-modal.component';
import { ImageChoiceComponent } from './components/sheet/image-choice/image-choice.component';
import { CropperComponent } from './components/modal/cropper/cropper.component';
import { DocumentComponent } from './pages/profile/document/document.component';
import { DocumentOptionComponent } from './components/sheet/document-option/document-option.component';
import { FileRenameComponent } from './components/modal/file-rename/file-rename.component';
import { DocumentOptionModalComponent } from './components/modal/document-option/document-option-modal.component';
import { BottomNavigationComponent } from './components/bottom-navigation/bottom-navigation.component';
import { DetailsVacancyComponent } from './components/details-vacancy/details-vacancy.component';
import { TermsUseComponent } from './components/terms-use/terms-use.component';
import { PasswordResetComponent } from './pages/auth/password-reset/password-reset.component';
import { MiscellaneousComponent } from './pages/profile/miscellaneous/miscellaneous.component';
import { AuthComponent } from './pages/auth/auth.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { ConfirmEmailComponent } from './components/modal/confirm-email/confirm-email.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { AccordionModule } from './components/accordion/accordion.module';
import { CvOptionModalComponent } from './components/modal/cv-option/cv-option-modal.component';
import { CvOptionComponent } from './components/sheet/cv-option/cv-option.component';
import { EmailResetComponent } from './pages/auth/email-reset/email-reset.component';

import { AgmCoreModule } from '@agm/core';
import { GoogleAutocompleteComponent } from './components/google-autocomplete/google-autocomplete.component';
import { AutocompleteDataService } from './services/autocomplete-data.service';
import { IMaskModule } from 'angular-imask';
import { DateService } from './services/date.service';

import { CompanyCreateComponent } from './pages/company/company-create/company-create.component';
import { CompanyEditComponent } from './pages/company/company-edit/company-edit.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { OptionsService } from './services/options.service';
import { JobSummaryCreateComponent } from './pages/job-summary/job-summary-create/job-summary-create.component';
import { JobSummaryEditComponent } from './pages/job-summary/job-summary-edit/job-summary-edit.component';

export const createTranslateLoader = (http: HttpClient, apiRoutesProvider: ApiRoutesProvider) => {
  return new HttpMultiLoaderServiceService(http, [
    { prefix: './assets/i18n', suffix: '.json' },
    { prefix: `${apiRoutesProvider.GET_LANG}` },
  ]);
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    CvOptionModalComponent,
    CvOptionComponent,
    NotFoundComponent,
    PersonalComponent,
    EducationComponent,
    ProfileCategoryItemComponent,
    CategoryNavHeaderComponent,
    AboutComponent,
    SearchSettingsComponent,
    ProfessionalBackgroundComponent,
    ConfirmModalComponent,
    ImageChoiceComponent,
    CropperComponent,
    DocumentComponent,
    DocumentOptionComponent,
    DocumentOptionModalComponent,
    FileRenameComponent,
    BottomNavigationComponent,
    DetailsVacancyComponent,
    TermsUseComponent,
    PasswordResetComponent,
    MiscellaneousComponent,
    AuthComponent,
    RegistrationComponent,
    ConfirmEmailComponent,
    EmailResetComponent,
    GoogleAutocompleteComponent,
    PrivacyPolicyComponent,
    CompanyCreateComponent,
    CompanyEditComponent,
    JobSummaryCreateComponent,
    JobSummaryEditComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    ImageCropperModule,
    NgxMaskModule.forRoot(),
    HammerConfig,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBULnvGFJFpAjIvmouIzlEh7_ge_GutzEk',
      libraries: ['places'],
      language: 'de'
    }),
    IMaskModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, ApiRoutesProvider]
      }
    }),
    BrowserAnimationsModule,
    CommonModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Validators,
    ApiRoutesProvider,
    AuthService,
    AutocompleteDataService,
    DateService,
    OptionsService,
    DownloadFileService,
    NotificationService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmModalComponent,
    ImageChoiceComponent,
    CropperComponent,
    CvOptionModalComponent,
    CvOptionComponent,
    DocumentOptionComponent,
    DocumentOptionModalComponent,
    FileRenameComponent,
    TermsUseComponent,
    ConfirmEmailComponent,
    PrivacyPolicyComponent
  ]
})
export class AppModule { }
