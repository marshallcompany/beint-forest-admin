import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-details-vacancy',
  templateUrl: './details-vacancy.component.html',
  styleUrls: ['./details-vacancy.component.scss']
})
export class DetailsVacancyComponent implements OnInit {

  @Input() vacancyData;

  constructor() { }

  ngOnInit() {
  }

}
