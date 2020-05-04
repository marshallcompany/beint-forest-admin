import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(
    @Optional() private matDialogRef: MatDialogRef<PrivacyPolicyComponent>
  ) { }

  ngOnInit() {
  }

  public closeDialog = () => {
    this.matDialogRef.close();
  }
}
