import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public routerStatus: boolean;
  private history = [];

  constructor(
    public router: Router,
    private authService: AuthService,
    private location: Location,
  ) { }

  ngOnInit() {
    if (this.authService.getAuthData()) {
      this.router.navigate(['/profile']);
    }
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(
        ({ urlAfterRedirects }: NavigationEnd) => {
          this.history = [...this.history, urlAfterRedirects];
          const routerStateHistory = this.history[this.history.length - 2] || '/index';
          const id = localStorage.getItem('JOB_ID');
          if (routerStateHistory === '/job-description' || routerStateHistory === `/apply/${id}/keep/true`) {
            this.routerStatus = true;
          } else {
            this.routerStatus = false;
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
