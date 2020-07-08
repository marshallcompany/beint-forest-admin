import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cv-option-modal',
  templateUrl: './cv-option-modal.component.html',
  styleUrls: ['./cv-option-modal.component.scss']
})
export class CvOptionModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<CvOptionModalComponent>
  ) { }

  ngOnInit() {

  }

  closeDialog($event) {
    this.matDialogRef.close($event);
  }

  sheetSelect = ($event) => {
    this.matDialogRef.close($event);
  }

}
