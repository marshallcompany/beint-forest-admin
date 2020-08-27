import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';


import { CompanyCreateComponent } from '../pages/company/company-create/company-create.component';
import { CompanyEditComponent } from '../pages/company/company-edit/company-edit.component';
import { JobSummaryCreateComponent } from '../pages/job-summary/job-summary-create/job-summary-create.component';
import { JobSummaryEditComponent } from '../pages/job-summary/job-summary-edit/job-summary-edit.component';
import { JobSummaryThxComponent } from '../pages/job-summary/job-summary-thx/job-summary-thx.component';
import { CompanyThxComponent } from '../pages/company/company-thx/company-thx.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

const routes: Route[] = [
  { path: 'company/create/:jwt', component: CompanyCreateComponent, canActivate: [AuthGuard]},
  { path: 'company/edit/:companyID/:jwt', component: CompanyEditComponent, canActivate: [AuthGuard] },
  { path: 'company/successful', component: CompanyThxComponent },
  { path: 'job-summary/create/:companyID/:jwt', component: JobSummaryCreateComponent, canActivate: [AuthGuard]},
  { path: 'job-summary/edit/:companyID/:jobSummaryId/:jwt', component: JobSummaryEditComponent },
  { path: 'job-summary/successful', component: JobSummaryThxComponent },
  { path: '', redirectTo: 'company/create', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class RoutingModule { }

