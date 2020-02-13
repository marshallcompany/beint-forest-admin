import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-category-item',
  templateUrl: './profile-category-item.component.html',
  styleUrls: ['./profile-category-item.component.scss']
})
export class ProfileCategoryItemComponent implements OnInit {

  @Input() category;

  constructor(
    public router: Router
  ) {

  }

  ngOnInit(): void {
  }

  public goToComponent = (path) => {
    this.router.navigate(path);
  }
}
