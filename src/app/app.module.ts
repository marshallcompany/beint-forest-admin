import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators }   from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PersonalDataComponent } from './pages/personal-data/personal-data.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PersonalDataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Validators],
  bootstrap: [AppComponent]
})
export class AppModule { }
