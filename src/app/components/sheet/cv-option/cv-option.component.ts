import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-cv-option',
  templateUrl: './cv-option.component.html',
  styleUrls: ['./cv-option.component.scss']
})
export class CvOptionComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef
  ) { }

  ngOnInit() {
  }

  sheetSelect = ($event) => {
    this.bottomSheetRef.dismiss($event);
  }
  sheetClose($event) {
    this.bottomSheetRef.dismiss($event);
  }

}
