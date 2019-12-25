import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { WelcomeGuard } from './guards/welcome.guard';

import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { JobDescriptionComponent } from './pages/job-description/job-description.component';
import { HomeComponent } from './pages/home/home.component';
import { PersonalContactComponent } from './pages/profile/personal-contact/personal-contact.component';
import { EducationComponent } from './pages/profile/education/education.component';


const itemRoutes: Routes = [
  { path: 'personal&contact', component: PersonalContactComponent },
  { path: 'education', component: EducationComponent },
];

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [WelcomeGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], children: itemRoutes },
  { path: 'job-description', component: JobDescriptionComponent, canActivate: [AuthGuard] },
  { path: 'apply/:jobId/keep/:keep', component: JobDescriptionComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

