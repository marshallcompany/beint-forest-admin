import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-nav-header',
  templateUrl: './category-nav-header.component.html',
  styleUrls: ['./category-nav-header.component.scss']
})
export class CategoryNavHeaderComponent implements OnInit {

  @Input() iconCategory;
  @Input() nameCategory;
  @Input() nextCategoryName;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  public closeCategory = () => {
    this.router.navigate(['profile']);
  }

  public nextCategory = () => {
    this.router.navigate([this.nextCategoryName]);
  }
}
