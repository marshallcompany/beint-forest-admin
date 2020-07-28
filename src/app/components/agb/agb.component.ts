import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agb',
  templateUrl: './agb.component.html',
  styleUrls: ['./agb.component.scss']
})
export class AgbComponent implements OnInit {


  public routerUrl: any;

  constructor(
    @Optional() private matDialogRef: MatDialogRef<AgbComponent>,
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

}
