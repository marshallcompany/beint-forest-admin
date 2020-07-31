import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() categoryPictureStatus;

  public routers: Array<RouterParams>;

  constructor(
    private router: Router
  ) {
    this.routers = [
      {
        routerName: 'Persönliches & Kontakt',
        routerLink: '/profile/personal',
        routerActive: 'active'
      },
      {
        routerName: 'Berufliche Ausbildung',
        routerLink: '/profile/education',
        routerActive: 'active'
      },
      {
        routerName: 'Beruflicher Werdegang',
        routerLink: '/profile/professional-background',
        routerActive: 'active'
      },
      {
        routerName: 'Such-Präferenzen',
        routerLink: '/profile/search-settings',
        routerActive: 'active'
      },
      {
        routerName: 'Dokumente',
        routerLink: '/profile/document',
        routerActive: 'active'
      },
      {
        routerName: 'Sonstiges',
        routerLink: '/profile/miscellaneous',
        routerActive: 'active'
      },
      {
        routerName: 'Ich über mich',
        routerLink: '/profile/about',
        routerActive: 'active'
      }
    ];
  }

  ngOnInit(): void {
  }


  public onBack = () => {
    this.router.navigate(['profile']);
  }

  public prevCategory = () => {
    if (this.navSettings && this.navSettings.prevCategory !== null) {
      this.router.navigate([this.navSettings.prevCategory]);
    } else {
      return false;
    }
  }

  public nextCategory = () => {
    if (this.navSettings && this.navSettings.nextCategory !== null) {
      this.router.navigate([this.navSettings.nextCategory]);
    } else {
      return false;
    }
  }
}
