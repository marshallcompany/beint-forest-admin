import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

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
