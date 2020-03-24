import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-image-choice',
  templateUrl: './image-choice.component.html',
  styleUrls: ['./image-choice.component.scss']
})
export class ImageChoiceComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef
  ) { }

  ngOnInit() {
  }

  public selectFile = (file) => {
    this.bottomSheetRef.dismiss(file);
  }
  public sheetDismiss = ($event) => {
    this.bottomSheetRef.dismiss($event);
  }
}
