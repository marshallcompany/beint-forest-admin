import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

interface Setting {
  icon: string;
  label: string;
  class?: string;
  event?: any;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public setting: Array<Setting>;
  public selectedIndex = null;
  public routerName: string;

  constructor(
    public authService: AuthService,
    public router: Router,
    private matDialog: MatDialog,
  ) {
    this.setting = [
      { icon: '../assets/image/settings/icon-01.svg', label: 'Passwort ändern', class: 'setting-button', event: 'password-reset' },
      { icon: '../assets/image/settings/icon-02.svg', label: 'E-Mail Adresse ändern', class: 'setting-button', event: 'email-reset' },
      { icon: '../assets/image/settings/icon-03.svg', label: 'Nutzungsbedingungen', class: 'setting-button', event: 'terms-use' },
      { icon: '../assets/image/settings/icon-04.svg', label: 'Datenschutzbestimmungen', class: 'setting-button', event: 'privacy-policy' },
      { icon: '../assets/image/settings/icon-05.svg', label: 'Support und Feedback', class: 'setting-button', event: 'support' },
      { icon: '../assets/image/settings/icon-06.svg', label: 'Benachrichtigungen', class: 'setting-button', event: 'notification' },
      { icon: '../assets/image/settings/icon-07.svg', label: 'Abmelden', class: 'setting-button logout', event: 'logout' },
      { icon: '../assets/image/settings/icon-08.svg', label: 'Konto löschen', class: 'setting-button remove', event: 'remove-account' },
    ];
  }

  ngOnInit() {
  }

  public clickEvent = (event, index) => {
    if (window.innerWidth >= 768) {
      this.selectedIndex = index + 1;
      this.routerName = event;
    }
    if (window.innerWidth <= 768) {
      switch (event) {
        case 'logout':
            this.logOut();
            break;
        case 'privacy-policy':
            this.router.navigate(['/settings/privacy-policy']);
            break;
        case 'remove-account':
            this.removeAccount();
            break;
        case 'terms-use':
            this.router.navigate(['/settings/terms-of-use']);
            break;
        case 'password-reset':
            this.router.navigate(['/settings/password-reset']);
            break;
        case 'email-reset':
          this.router.navigate(['/settings/email-reset']);
          break;
        case 'support':
          this.router.navigate(['/settings/support']);
          break;
        case 'notification':
          this.router.navigate(['/settings/notification']);
          break;
        default:
          break;
      }
    }
  }

  public removeAccountCancel = (event: boolean) => {
    if (!event) {
      this.selectedIndex = null;
    }
  }


  public logOut = () => {
    const confirmConfig = {
      title: 'Wirklich abmelden?',
      labelConfirmButton: 'Abmelden',
      confirmButtonColor: '#434784',
      labelCancelButton: 'Abbrechen'
    };
    this.matDialog.open(ConfirmModalComponent, { data: confirmConfig, panelClass: 'confirm-dialog' }).afterClosed()
      .pipe()
      .subscribe(
        res => {
          if (res) {
            this.authService.logout();
          }
          this.selectedIndex = null;
        }
      );
  }

  public removeAccount = () => {
    const removeAccountConfirmOne = {
      title: 'Möchtest Du Dein Konto wirklich löschen? Bitte beachte, dass sich Deine Daten dann nicht mehr wieder herstellen lassen!',
      labelCancelButton: 'Abbrechen',
      labelConfirmButton: 'KONTO LÖSCHEN',
      confirmButtonColor: '#434784'

    };
    const removeAccountConfirmTwo = {
      title: 'DEIN KONTO WIRD JETZT UNWIDERRUFLICH GELÖSCHT!',
      labelCancelButton: 'Abbrechen',
      labelConfirmButton: 'KONTO LÖSCHEN',
      confirmButtonColor: '#434784'

    };
    this.matDialog.open(ConfirmModalComponent, { data: removeAccountConfirmOne, panelClass: 'confirm-dialog' }).afterClosed()
      .pipe(
        switchMap((confirmEventOne: boolean) => {
          if (confirmEventOne) {
            return this.matDialog.open(ConfirmModalComponent, { data: removeAccountConfirmTwo, panelClass: 'confirm-dialog' }).afterClosed();
          }
          return throwError(`REMOVE ACCOUNT ${confirmEventOne}`);
        }),
        switchMap((confirmEventTwo: boolean) => {
          if (confirmEventTwo) {
            return this.authService.removeAccount();
          }
          return throwError(`REMOVE ACCOUNT ${confirmEventTwo}`);
        })
      )
      .subscribe(
        res => {
          console.log('[ REMOVE ACCOUNT RESULT]', res);
          localStorage.removeItem('SHOW_CONFIRM_EMAIL');
          localStorage.removeItem('JWT_TOKEN');
          localStorage.removeItem('REFRESH_TOKEN');
          window.location.replace('http://www.beint.de/');
        },
        error => {
          console.log('[ REMOVE ACCOUNT ERROR ]', error);
        }
      );
  }
}
