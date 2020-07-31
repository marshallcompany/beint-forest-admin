import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoutingModule } from './modules/routing.module';
import { ApiRoutesProvider } from './services/api-routes.services';

import { AuthService } from './services/auth.service';
import { DownloadFileService } from './services/download-file.service';

import { Interceptors } from './interceptors/index';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpMultiLoaderServiceService } from './services/http-multi-loader-service';
import { NotificationService } from './services/notification.service';
import { GlobalErrorService } from './services/global-error-service';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

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
import { OfferComponent } from './pages/offer/offer.component';
import { OfferThanksComponent } from './pages/offer/offer-thanks/offer-thanks.component';
import { HomeComponent } from './pages/home/home.component';
import { ApplyComponent } from './pages/apply/apply.component';
import { ApplyThanksComponent } from './pages/apply/apply-thanks/apply-thanks.component';
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
import { SettingsComponent } from './pages/settings/settings.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RemoveAccountComponent } from './pages/settings/remove-account/remove-account.component';
import { SearchComponent } from './pages/search/search.component';
import { DetailsVacancyComponent } from './components/details-vacancy/details-vacancy.component';
import { PipelineComponent } from './pages/pipeline/pipeline.component';
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
import { SupportComponent } from './pages/settings/support/support.component';
import { EmailResetComponent } from './pages/auth/email-reset/email-reset.component';
import { NotificationComponent } from './pages/settings/notification/notification.component';
import { AgbComponent } from './components/agb/agb.component';


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
    HomeComponent,
    PersonalComponent,
    EducationComponent,
    OfferComponent,
    OfferThanksComponent,
    ApplyComponent,
    ApplyThanksComponent,
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
    SettingsComponent,
    PrivacyPolicyComponent,
    AgbComponent,
    RemoveAccountComponent,
    SearchComponent,
    DetailsVacancyComponent,
    PipelineComponent,
    TermsUseComponent,
    PasswordResetComponent,
    MiscellaneousComponent,
    AuthComponent,
    RegistrationComponent,
    ConfirmEmailComponent,
    SupportComponent,
    EmailResetComponent,
    NotificationComponent
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ImageCropperModule,
    NgxMaskModule.forRoot(),
    HammerConfig,
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
    NgCircleProgressModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Validators,
    ApiRoutesProvider,
    AuthService,
    DownloadFileService,
    NotificationService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
    // { provide: HTTP_INTERCEPTORS, useClass: Interceptors.contentType, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.accessToken, multi: true },
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
    PrivacyPolicyComponent,
    AgbComponent,
    TermsUseComponent,
    ConfirmEmailComponent
  ]
})
export class AppModule { }
