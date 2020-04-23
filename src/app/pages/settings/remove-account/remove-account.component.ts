import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-remove-account',
  templateUrl: './remove-account.component.html',
  styleUrls: ['./remove-account.component.scss']
})
export class RemoveAccountComponent implements OnInit {

  @Output() removeChanges = new EventEmitter();

  public removeAccountSteps: boolean;
  constructor() {
    this.removeAccountSteps = false;
  }

  ngOnInit() {
  }


  public removeAccountCancel = () => {
    this.removeAccountSteps = false;
    this.removeChanges.emit(false);
  }

  public removeAccountConfirm = () => {
    if (!this.removeAccountSteps) {
      this.removeAccountSteps = true;
      return;
    }
    if (this.removeAccountSteps) {
      console.log('Remove account');
    }
  }

}
