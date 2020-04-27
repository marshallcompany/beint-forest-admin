import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.scss']
})
export class RemoveAccountComponent implements OnInit {

  @Output() removeChanges = new EventEmitter();

  public removeAccountSteps: boolean;
  constructor(
    public auth: AuthService,
    private globalErrorService: GlobalErrorService
  ) {
    this.removeAccountSteps = false;
  }

  ngOnInit() {
  }


  public removeAccountCancel = () => {
    this.removeAccountSteps = false;
    this.removeChanges.emit(false);
  }

  public removeAccountConfirm = () => {
    if (!this.removeAccountSteps) {
      this.removeAccountSteps = true;
      return;
    }
    if (this.removeAccountSteps) {
      this.removeAccount();
    }
  }

  public removeAccount = () => {
    this.auth.removeAccount()
      .pipe()
      .subscribe(
        res => {
          console.log('[ REMOVE ACCOUNT ]', res);
          localStorage.removeItem('JWT_TOKEN');
          localStorage.removeItem('REFRESH_TOKEN');
          window.location.replace('http://www.beint.de/');
        },
        error => {
          console.log('[ REMOVE ACCOUNT ERROR ]', error);
          this.globalErrorService.handleError(error);
        }
      );
  }
}
