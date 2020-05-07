import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-terms-use',
  templateUrl: './terms-use.component.html',
  styleUrls: ['./terms-use.component.scss'],
})
export class TermsUseComponent implements OnInit {

  public routerUrl: any;

  constructor(
    @Optional() public matDialogRef: MatDialogRef<TermsUseComponent>,
    public location: Location,
    public router: Router,
  ) {
    this.routerUrl = this.router.url;
  }

  ngOnInit() {
  }

  public closeDialog = () => {
    this.matDialogRef.close();
  }

  public backRoute = () => {
    this.location.back();
  }

  onResize(event) {
    if (event.target.innerWidth >= 768) {
      this.location.back();
    }
  }
}
