import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import { MatDialog } from '@angular/material';
import { PrivacyPolicyComponent } from 'src/app/components/privacy-policy/privacy-policy.component';
import { switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TermsUseComponent } from 'src/app/components/terms-use/terms-use.component';
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

  constructor(
    public authService: AuthService,
    public router: Router,
    private matDialog: MatDialog,
  ) {
    this.setting = [
      { icon: '../assets/image/settings/icon-01.svg', label: 'Passwort ändern', class: 'setting-button', event: 'password-reset' },
      { icon: '../assets/image/settings/icon-02.svg', label: 'Email Adresse ändern', class: 'setting-button' },
      { icon: '../assets/image/settings/icon-03.svg', label: 'Nutzungsbedingungen', class: 'setting-button', event: 'termsUse' },
      { icon: '../assets/image/settings/icon-04.svg', label: 'Datenschutzbestimmungen', class: 'setting-button', event: 'privacyPolicy' },
      { icon: '../assets/image/settings/icon-05.svg', label: 'Support und Feedback', class: 'setting-button' },
      { icon: '../assets/image/settings/icon-06.svg', label: 'Benachrictigungen', class: 'setting-button' },
      { icon: '../assets/image/settings/icon-07.svg', label: 'Abmelden', class: 'setting-button logout', event: 'logout' },
      { icon: '../assets/image/settings/icon-08.svg', label: 'Konto löschen', class: 'setting-button remove', event: 'removeAccount' },
    ];
  }

  ngOnInit() {
  }

  public clickEvent = (event, index) => {
    if (window.innerWidth >= 768) {
      this.selectedIndex = index + 1;
    }
    switch (event) {
      case 'logout':
        if (window.innerWidth <= 768) {
          this.logOut();
        }
        break;
      case 'privacyPolicy':
        if (window.innerWidth <= 768) {
          this.router.navigate(['/settings/privacy-policy']);
        }
        break;
      case 'removeAccount':
        if (window.innerWidth <= 768) {
          this.removeAccount();
        }
        break;
      case 'termsUse':
        if (window.innerWidth <= 768) {
          this.router.navigate(['/settings/terms-of-use']);
        }
        break;
      case 'password-reset':
        if (window.innerWidth <= 768) {
          this.router.navigate(['/settings/password-reset']);
        }
        break;
      default:
        break;
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
