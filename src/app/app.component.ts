import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public backStatus: boolean;
  constructor(
    public router: Router,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    this.router.events
      .pipe()
      .subscribe(
        res => {
          console.log(res);
          if (res instanceof NavigationStart) {
            console.log(res);
            if (res.url === '/profile') {
              this.backStatus = true;
            } else {
              this.backStatus = false;
            }
          }
        }
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  public backRouter = () => {
    this.location.back();
  }
  public goToComponent = (name: string, nav: any) => {
    this.router.navigate([`${name}`]);
    nav.toggle();
  }
}
