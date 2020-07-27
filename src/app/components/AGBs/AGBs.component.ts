import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agbs',
  templateUrl: './AGBs.component.html',
  styleUrls: ['./AGBs.component.scss']
})
export class AGBsComponent implements OnInit {


  public routerUrl: any;

  constructor(
    @Optional() private matDialogRef: MatDialogRef<AGBsComponent>,
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

}
