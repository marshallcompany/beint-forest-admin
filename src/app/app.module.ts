import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { ApiRoutesProvider } from './services/api-routes.services';
import { AuthService } from './services/auth.service';
import { DownloadFileService } from './services/download-file.service';

import { Interceptors } from './interceptors/index';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ApplicationComponent } from './pages/application/application.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { JobDescriptionComponent } from './pages/job-description/job-description.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpMultiLoaderServiceService } from './services/http-multi-loader-service';


export const createTranslateLoader = (http: HttpClient, ApiRoutesProvider: ApiRoutesProvider) => {
  return new HttpMultiLoaderServiceService(http, [
    { prefix: './assets/i18n', suffix: '.json' },
    { prefix: `${ApiRoutesProvider.GET_LANG}` },
  ]);
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ApplicationComponent,
    NotFoundComponent,
    JobDescriptionComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, ApiRoutesProvider]
      }
    }),
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [
    Validators,
    ApiRoutesProvider,
    AuthService,
    DownloadFileService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.contentType, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.accessToken, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
