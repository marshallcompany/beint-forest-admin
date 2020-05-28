import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public resendEmailStatus = false;
  public loadingStatus  = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ConfirmEmailComponent>,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  public close = ($event) => {
    this.matDialogRef.close($event);
  }

  public resendEmail = () => {
    this.loadingStatus = true;
    this.auth.resendVerificationEmail()
    .pipe()
    .subscribe(
      res => {
        console.log('[ RESEND VERIFICATION EMAIL RESULT ]', res);
        this.resendEmailStatus = !this.resendEmailStatus;
        this.loadingStatus = false;
      },
      error => {
        console.log('[ RESEND VERIFICATION EMAIL ERROR ]', error);
      }
    );
  }

}
