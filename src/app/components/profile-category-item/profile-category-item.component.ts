import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-category-item',
  templateUrl: './profile-category-item.component.html',
  styleUrls: ['./profile-category-item.component.scss']
})
export class ProfileCategoryItemComponent implements OnInit {

  @Input() category;

  constructor() { }

  ngOnInit(): void {
  }

}
