import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-document-option-modal',
  templateUrl: './document-option-modal.component.html',
  styleUrls: ['./document-option-modal.component.scss']
})
export class DocumentOptionModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<DocumentOptionModalComponent>
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
