import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoutingModule } from './modules/routing.module';
import { ApiRoutesProvider } from './services/api-routes.services';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpMultiLoaderServiceService } from './services/http-multi-loader-service';
import { NotificationService } from './services/notification.service';
import { GlobalErrorService } from './services/global-error-service';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Interceptors } from './interceptors/index';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProfileCategoryItemComponent } from './components/profile-category-item/profile-category-item.component';
import { ImageChoiceComponent } from './components/sheet/image-choice/image-choice.component';
import { CropperComponent } from './components/modal/cropper/cropper.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AccordionModule } from './components/accordion/accordion.module';
import { AgmCoreModule } from '@agm/core';
import { GoogleAutocompleteComponent } from './components/google-autocomplete/google-autocomplete.component';
import { AutocompleteDataService } from './services/autocomplete-data.service';
import { IMaskModule } from 'angular-imask';
import { DateService } from './services/date.service';
import { CompanyCreateComponent } from './pages/company/company-create/company-create.component';
import { CompanyEditComponent } from './pages/company/company-edit/company-edit.component';
import { OptionsService } from './services/options.service';
import { JobSummaryCreateComponent } from './pages/job-summary/job-summary-create/job-summary-create.component';
import { JobSummaryEditComponent } from './pages/job-summary/job-summary-edit/job-summary-edit.component';
import { JobSummaryThxComponent } from './pages/job-summary/job-summary-thx/job-summary-thx.component';
import { CompanyThxComponent } from './pages/company/company-thx/company-thx.component';

export const createTranslateLoader = (http: HttpClient, apiRoutesProvider: ApiRoutesProvider) => {
  return new HttpMultiLoaderServiceService(http, [
    { prefix: './assets/i18n', suffix: '.json' },
    { prefix: `${apiRoutesProvider.GET_LANG}` },
  ]);
};

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ProfileCategoryItemComponent,
    ImageChoiceComponent,
    CropperComponent,
    GoogleAutocompleteComponent,
    CompanyCreateComponent,
    CompanyThxComponent,
    CompanyEditComponent,
    JobSummaryCreateComponent,
    JobSummaryThxComponent,
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
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.accessToken, multi: true },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ImageChoiceComponent,
    CropperComponent
  ]
})
export class AppModule { }
