import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { PersonalDataComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: PersonalDataComponent, canActivate: [AuthGuard] },
  { path: 'apply/:jobId', component: PersonalDataComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/profile', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: PersonalDataComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    // { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

