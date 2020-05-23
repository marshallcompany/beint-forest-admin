import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public emailStatus = false;
  constructor(
    private matDialogRef: MatDialogRef<ConfirmEmailComponent>
  ) { }

  ngOnInit() {
  }

  public close = ($event) => {
    this.matDialogRef.close($event);
  }

}
