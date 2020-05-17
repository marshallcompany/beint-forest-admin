import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  styleUrls: ['./miscellaneous.component.scss']
})
export class MiscellaneousComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/menu/profile.svg',
    nameCategory: 'Sonstiges',
    nextCategory: 'profile/about',
    prevCategory: 'profile/document'
  };

  constructor() { }

  ngOnInit() {
  }

}
