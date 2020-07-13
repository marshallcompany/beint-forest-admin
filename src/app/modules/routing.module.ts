import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { WelcomeGuard } from '../guards/welcome.guard';

import { AuthComponent } from '../pages/auth/auth.component';
import { LoginComponent } from '../pages/auth/login/login.component';
import { PasswordResetComponent } from '../pages/auth/password-reset/password-reset.component';

import { ProfileComponent } from '../pages/profile/profile.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { HomeComponent } from '../pages/home/home.component';
import { PersonalComponent } from '../pages/profile/personal/personal.component';
import { EducationComponent } from '../pages/profile/education/education.component';
import { OfferComponent } from '../pages/offer/offer.component';
import { OfferThanksComponent } from '../pages/offer/offer-thanks/offer-thanks.component';
import { ApplyComponent } from '../pages/apply/apply.component';
import { ApplyThanksComponent } from '../pages/apply/apply-thanks/apply-thanks.component';
import { AboutComponent } from '../pages/profile/about/about.component';
import { SearchSettingsComponent } from '../pages/profile/search-settings/search-settings.component';
import { ProfessionalBackgroundComponent } from '../pages/profile/professional-background/professional-background.component';
import { DocumentComponent } from '../pages/profile/document/document.component';
import { SettingsComponent } from '../pages/settings/settings.component';
import { SearchComponent } from '../pages/search/search.component';
import { PipelineComponent } from '../pages/pipeline/pipeline.component';
import { TermsUseComponent } from '../components/terms-use/terms-use.component';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy.component';
import { MiscellaneousComponent } from '../pages/profile/miscellaneous/miscellaneous.component';
import { RegistrationComponent } from '../pages/auth/registration/registration.component';
import { SupportComponent } from '../pages/settings/support/support.component';
import { EmailResetComponent } from '../pages/auth/email-reset/email-reset.component';
import { NotificationComponent } from '../pages/settings/notification/notification.component';






const profileChildren: Routes = [
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard] },
  { path: 'education', component: EducationComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'search-settings', component: SearchSettingsComponent, canActivate: [AuthGuard] },
  { path: 'professional-background', component: ProfessionalBackgroundComponent, canActivate: [AuthGuard] },
  { path: 'document', component: DocumentComponent, canActivate: [AuthGuard] },
  { path: 'miscellaneous', component: MiscellaneousComponent, canActivate: [AuthGuard]}
];

const authChildren: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [WelcomeGuard] },
  { path: 'password-reset', component: PasswordResetComponent, canActivate: [WelcomeGuard] },
  { path: 'registration', component: RegistrationComponent, canActivate: [WelcomeGuard] }
];

const routes: Route[] = [
  { path: 'auth', component: AuthComponent, canActivate: [WelcomeGuard], children: authChildren },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: profileChildren },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'apply/:jobId/keep/:keep', component: ApplyComponent },
  { path: 'apply-thanks/:jobId/keep/:keep', component: ApplyThanksComponent },
  { path: 'offer/:jobId', component: OfferComponent, canActivate: [AuthGuard] },
  { path: 'offer-thanks', component: OfferThanksComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'pipeline', component: PipelineComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'settings/password-reset', component: PasswordResetComponent },
  { path: 'settings/terms-of-use', component: TermsUseComponent },
  { path: 'settings/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'settings/support', component: SupportComponent },
  { path: 'settings/email-reset', component: EmailResetComponent },
  { path: 'settings/notification', component: NotificationComponent },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class RoutingModule { }

