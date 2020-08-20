import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { WelcomeGuard } from '../guards/welcome.guard';

import { AuthComponent } from '../pages/auth/auth.component';
import { LoginComponent } from '../pages/auth/login/login.component';
import { PasswordResetComponent } from '../pages/auth/password-reset/password-reset.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { PersonalComponent } from '../pages/profile/personal/personal.component';
import { EducationComponent } from '../pages/profile/education/education.component';
import { AboutComponent } from '../pages/profile/about/about.component';
import { SearchSettingsComponent } from '../pages/profile/search-settings/search-settings.component';
import { ProfessionalBackgroundComponent } from '../pages/profile/professional-background/professional-background.component';
import { DocumentComponent } from '../pages/profile/document/document.component';
import { TermsUseComponent } from '../components/terms-use/terms-use.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { MiscellaneousComponent } from '../pages/profile/miscellaneous/miscellaneous.component';
import { RegistrationComponent } from '../pages/auth/registration/registration.component';
import { EmailResetComponent } from '../pages/auth/email-reset/email-reset.component';


import { CompanyCreateComponent } from '../pages/company/company-create/company-create.component';
import { CompanyEditComponent } from '../pages/company/company-edit/company-edit.component';






const profileChildren: Routes = [
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard]},
  { path: 'education', component: EducationComponent, canActivate: [AuthGuard]},
  { path: 'professional-background', component: ProfessionalBackgroundComponent, canActivate: [AuthGuard]},
  { path: 'search-settings', component: SearchSettingsComponent, canActivate: [AuthGuard]},
  { path: 'document', component: DocumentComponent, canActivate: [AuthGuard]},
  { path: 'miscellaneous', component: MiscellaneousComponent, canActivate: [AuthGuard]},
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard]}
];

const authChildren: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [WelcomeGuard] },
  { path: 'password-reset', component: PasswordResetComponent, canActivate: [WelcomeGuard] },
  { path: 'registration', component: RegistrationComponent, canActivate: [WelcomeGuard] }
];

const routes: Route[] = [
  { path: 'auth', component: AuthComponent, canActivate: [WelcomeGuard], children: authChildren },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: profileChildren },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'settings/password-reset', component: PasswordResetComponent },
  { path: 'settings/terms-of-use', component: TermsUseComponent },
  { path: 'settings/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'settings/email-reset', component: EmailResetComponent },
  { path: 'company/create', component: CompanyCreateComponent },
  { path: 'company/edit/:id', component: CompanyEditComponent },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class RoutingModule { }

