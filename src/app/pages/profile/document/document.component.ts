import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  public navSettings = {
    iconCategory: '../assets/image/profile/category-05.svg',
    nameCategory: 'Dokumente',
    nextCategory: 'about',
    prevCategory: 'search-settings'
  };

  constructor() { }

  ngOnInit() {
  }

}
