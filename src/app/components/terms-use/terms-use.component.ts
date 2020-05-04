import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-terms-use',
  templateUrl: './terms-use.component.html',
  styleUrls: ['./terms-use.component.scss'],
})
export class TermsUseComponent implements OnInit {

  constructor(
    @Optional() public matDialogRef: MatDialogRef<TermsUseComponent>
  ) { }


  ngOnInit() {
  }

  public closeDialog = () => {
    this.matDialogRef.close();
  }

}
