import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(
    private matDialogRef: MatDialogRef<ConfirmModalComponent>
  ) { }

  ngOnInit() {
  }

  public close = ($event) => {
    this.matDialogRef.close($event);
  }
  public save = ($event) => {
    this.matDialogRef.close($event);
  }
}
