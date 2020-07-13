import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-email-reset',
  templateUrl: './email-reset.component.html',
  styleUrls: ['./email-reset.component.scss']
})
export class EmailResetComponent implements OnInit {

  public routerUrl;

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
