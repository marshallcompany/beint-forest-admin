import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService, Profile } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';

interface Category {
  name: string;
  icon: string;
  path: Array<string>;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public categories: Array<Category>;
  public editProfileStatus: boolean;

  constructor(
    private router: Router
  ) {
    this.editProfileStatus = false;

    this.categories = [
      { name: 'Persönliches & Kontakt', icon: '../assets/image/profile/category-01.svg', path: ['personal'] },
      { name: 'Berufliche Ausbildung', icon: '../assets/image/profile/category-02.svg', path: ['personal'] },
      { name: 'Beruflicher Werdegang', icon: '../assets/image/profile/category-03.svg', path: ['personal'] },
      { name: 'Such-Präferenzen', icon: '../assets/image/profile/category-04.svg', path: ['personal'] },
      { name: 'Dokumente', icon: '../assets/image/profile/category-05.svg', path: ['personal'] },
      { name: 'Sonstiges', icon: '../assets/image/profile/category-06.svg', path: ['personal'] },
      { name: 'Ich über mich', icon: '../assets/image/profile/category-07.svg', path: ['personal'] }
    ];

  }

  ngOnInit() {
  }

  public showEditCategory = (router?: string) => {
    this.editProfileStatus = !this.editProfileStatus;
    if (router) {
      this.router.navigate([router]);
    }
  }
}
