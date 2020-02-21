import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

interface RouterParams {
  routerName: string;
  routerLink: string;
  routerActive: string;
}

@Component({
  selector: 'app-category-nav-header',
  templateUrl: './category-nav-header.component.html',
  styleUrls: ['./category-nav-header.component.scss']
})
export class CategoryNavHeaderComponent implements OnInit {

  @Input() navSettings;

  public routers: Array<RouterParams>;

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.routers = [
      {
        routerName: 'Persönliches & Kontakt',
        routerLink: '/personal',
        routerActive: 'active'
      },
      {
        routerName: 'Berufliche Ausbildung',
        routerLink: '/',
        routerActive: ''
      },
      {
        routerName: 'Beruflicher Werdegang',
        routerLink: '/professional-background',
        routerActive: 'active'
      },
      {
        routerName: 'Such-Präferenzen',
        routerLink: '/search-settings',
        routerActive: 'active'
      },
      {
        routerName: 'Dokumente',
        routerLink: '/',
        routerActive: ''
      },
      {
        routerName: 'Sonstiges',
        routerLink: '/',
        routerActive: '---'
      },
      {
        routerName: 'Ich über mich',
        routerLink: '/about',
        routerActive: 'active'
      }
    ];
  }

  ngOnInit(): void {
    console.log(this.navSettings);
  }


  public closeCategory = () => {
    this.router.navigate(['profile']);
  }


  public prevCategory = () => {
    this.location.back();
  }

  public nextCategory = () => {
    if (this.navSettings && this.navSettings.nextCategory !== null) {
      this.router.navigate([this.navSettings.nextCategory]);
    } else {
      return false;
    }
  }
}
