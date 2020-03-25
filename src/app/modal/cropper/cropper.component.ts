import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageTransform, ImageCropperComponent } from 'ngx-image-cropper';
@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss']
})
export class CropperComponent implements OnInit {

  @ViewChild('ImageCropperComponent', { static: false }) imageCropper: ImageCropperComponent;

  public imageLoadedStatus = true;
  public canvasRotation = 0;
  public transform: ImageTransform = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<CropperComponent>
  ) { }

  ngOnInit() { }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  crop() {
    this.matDialogRef.close(this.imageCropper.crop());
  }

  imageLoaded() {
    this.imageLoadedStatus = false;
  }

}
