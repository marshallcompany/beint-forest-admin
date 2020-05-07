import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {


  public routerUrl: any;

  constructor(
    @Optional() private matDialogRef: MatDialogRef<PrivacyPolicyComponent>,
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
