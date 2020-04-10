import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmModalComponent } from 'src/app/components/modal/confirm/confirm-modal.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
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
        }
      );
  }
}
