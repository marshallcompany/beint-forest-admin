import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';
import { switchMap } from 'rxjs/operators';
import { ConfirmEmailComponent } from 'src/app/components/modal/confirm-email/confirm-email.component';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private profileService: ProfileService,
    private globalErrorService: GlobalErrorService
  ) {
  }

  ngOnInit() {
    this.init();
  }

  private init = () => {
    this.profileService.getProfile()
      .pipe(
        switchMap(data => {
          if (!localStorage.getItem('SHOW_CONFIRM_EMAIL') && !data.isEmailConfirmed) {
            this.matDialog.open(ConfirmEmailComponent, { data: { firstName: data.profile.personal.firstName }, panelClass: 'confirm-email-dialog' }).afterClosed()
              .pipe()
              .subscribe(
                res => {
                  localStorage.setItem('SHOW_CONFIRM_EMAIL', 'true');
                }
              );
          }
          return of(data);
        })
      )
      .subscribe(
        data => {
          this.user = data;
          console.log('[ USER DATA ]', this.user);
        },
        err => {
          this.globalErrorService.handleError(err);
          console.log('[ ERROR USER DATA ]', err);
        },
        () => console.log('[ USER DATA DONE ]')
      );
  }

  public goToProfile = () => {
    this.router.navigate(['/profile']);
  }
  public offer = (id) => {
    this.router.navigate([`/offer/${id}`]);
  }

  public openGroup = (e) => {
    e.classList.add('acord-active');
  }

  public closeGroup = (e) => {
    e.classList.remove('acord-active');
  }

}
