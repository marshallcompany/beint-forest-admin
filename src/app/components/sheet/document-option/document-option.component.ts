import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-document-option',
  templateUrl: './document-option.component.html',
  styleUrls: ['./document-option.component.scss']
})
export class DocumentOptionComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef
  ) { }

  ngOnInit() {
  }

  sheetSelect = ($event) => {
    this.bottomSheetRef.dismiss($event);
  }

}
