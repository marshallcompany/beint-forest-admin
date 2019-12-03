import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonalDataComponent } from './pages/profile/profile.component';

import { ApiRoutesProvider } from './services/api-routes';
import { AuthService } from './services/auth';
import { Interceptors } from './interceptors/index';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PersonalDataComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    Validators,
    ApiRoutesProvider,
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.contentType, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.accessToken, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
