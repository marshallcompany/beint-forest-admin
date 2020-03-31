import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-document-option-modal',
  templateUrl: './document-option-modal.component.html',
  styleUrls: ['./document-option-modal.component.scss']
})
export class DocumentOptionModalComponent implements OnInit {

  constructor(
    private matDialogRef: MatDialogRef<DocumentOptionModalComponent>
  ) { }

  ngOnInit() {
  }

  sheetSelect = ($event) => {
    this.matDialogRef.close($event);
  }

}
