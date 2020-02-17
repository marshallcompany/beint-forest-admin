import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';

import { RoutingModule } from './modules/routing.module';
import { ApiRoutesProvider } from './services/api-routes.services';

import { AuthService } from './services/auth.service';
import { DownloadFileService } from './services/download-file.service';

import { Interceptors } from './interceptors/index';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpMultiLoaderServiceService } from './services/http-multi-loader-service';
import { NotificationService } from './services/notification.service';
import { GlobalErrorService } from './services/global-error-service';

import { NgCircleProgressModule } from 'ng-circle-progress';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MaterialModule } from './modules/material.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { JobDescriptionComponent } from './pages/job-description/job-description.component';
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


const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

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
    NotFoundComponent,
    JobDescriptionComponent,
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
  ],
  imports: [
    RoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SwiperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, ApiRoutesProvider]
      }
    }),
    BrowserAnimationsModule,
    MaterialModule,
    NgCircleProgressModule.forRoot()
  ],
  providers: [
    Validators,
    ApiRoutesProvider,
    AuthService,
    DownloadFileService,
    NotificationService,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorService
    },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.contentType, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.accessToken, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
