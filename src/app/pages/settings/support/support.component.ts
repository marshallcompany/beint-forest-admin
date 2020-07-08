import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  public routerUrl: any;

  constructor(
    public authService: AuthService,
    public router: Router,
    private location: Location

  ) {
    this.routerUrl = this.router.url;
  }

  ngOnInit() {
  }

  public backRoute = () => {
    this.location.back();
  }

  onResize(event) {
    if (event.target.innerWidth >= 768) {
      this.location.back();
    }
  }
}
