import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
