import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { WelcomeGuard } from '../guards/welcome.guard';

import { LoginComponent } from '../pages/login/login.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { JobDescriptionComponent } from '../pages/job-description/job-description.component';
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




const profileChildren: Routes = [
  { path: 'personal', component: PersonalComponent, canActivate: [AuthGuard] },
  { path: 'education', component: EducationComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'search-settings', component: SearchSettingsComponent, canActivate: [AuthGuard] },
  { path: 'professional-background', component: ProfessionalBackgroundComponent, canActivate: [AuthGuard] },
  { path: 'document', component: DocumentComponent, canActivate: [AuthGuard] },
];

const routes: Route[] = [
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: profileChildren },
  { path: 'login', component: LoginComponent, canActivate: [WelcomeGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'apply', component: ApplyComponent },
  { path: 'apply-thanks', component: ApplyThanksComponent },
  { path: 'offer/:jobId', component: OfferComponent, canActivate: [AuthGuard] },
  { path: 'offer-thanks', component: OfferThanksComponent, canActivate: [AuthGuard] },
  { path: 'job-description', component: JobDescriptionComponent, canActivate: [AuthGuard] },
  { path: 'apply/:jobId/keep/:keep', component: JobDescriptionComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class RoutingModule { }

