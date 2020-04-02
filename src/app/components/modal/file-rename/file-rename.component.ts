import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-file-rename',
  templateUrl: './file-rename.component.html',
  styleUrls: ['./file-rename.component.scss']
})
export class FileRenameComponent implements OnInit {
  public fileName;
  constructor(
    private matDialogRef: MatDialogRef<FileRenameComponent>
  ) { }

  ngOnInit() {
  }

  save(value) {
    this.matDialogRef.close(value);
  }

  closeDialog($event) {
    this.matDialogRef.close($event);
  }
}
