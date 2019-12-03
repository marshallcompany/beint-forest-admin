import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators }   from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonalDataComponent } from './pages/personal-data/personal-data.component';

import { RouterModule, Routes } from '@angular/router'

import { RestProvider } from './providers/rest/rest';
import { ApiRoutesProvider } from './providers/api-routes/api-routes'
import { AuthProvider } from './providers/auth/auth'
import { Interceptors } from './interceptors/index'

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'personal-data',      component: PersonalDataComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PersonalDataComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    Validators,
    RestProvider,
    ApiRoutesProvider,
    AuthProvider,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptors.standardHeaders, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
