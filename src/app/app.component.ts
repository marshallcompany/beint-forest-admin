import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { filter } from 'rxjs/operators';
import { TranslatesService } from './services/translates.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { SwUpdate } from '@angular/service-worker';

interface State {
  name: string;
  icon: string;
  path: string;
  activeClass: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public stateRoute: Array<State>;

  // public routerStatus: boolean;
  // private history = [];
  public routerClass: string;

  constructor(
    public router: Router,
    public authService: AuthService,
    public notificationService: NotificationService,
    public dateTimeAdapter: DateTimeAdapter<any>,
    public updates: SwUpdate,
    private translatesService: TranslatesService
  ) {
    this.stateRoute = [
      { name: 'Home', icon: '../assets/image/menu/home.svg', path: 'home', activeClass: 'route-active' },
      { name: 'Deine Bewerbungen', icon: '../assets/image/menu/file.svg', path: 'pipeline', activeClass: 'route-active' },
      { name: 'Dein Profil', icon: '../assets/image/menu/profile.svg', path: 'profile', activeClass: 'route-active' },
      { name: 'Einstellungen', icon: '../assets/image/menu/settings.svg', path: 'settings', activeClass: 'route-active' },
      { name: 'Jobs', icon: '../assets/image/menu/search.svg', path: 'search', activeClass: 'route-active' }
    ];
    updates.available
    .pipe()
    .subscribe((event) => {
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit() {
    this.translatesService.initLanguage();
    this.checkRouterState();
    this.dateTimeAdapter.setLocale('de');
  }

  private checkRouterState = () => {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(
        ({ urlAfterRedirects }: NavigationEnd) => {
          // this.activeRouter = urlAfterRedirects;
          // this.history = [...this.history, urlAfterRedirects];
          // const routerStateHistory = this.history[this.history.length - 2] || '/index';
          // if (routerStateHistory === '/job-description' || routerStateHistory.includes('/apply/')) {
          //   this.routerStatus = true;
          // } else {
          //   this.routerStatus = false;
          // }
          if (document.getElementsByTagName('mat-sidenav-content')[0]) {
            document.getElementsByTagName('mat-sidenav-content')[0].scrollTo(0, 0);
            console.log('mat-sidenav-content');
          }
          this.routerClass = 'router-' + urlAfterRedirects.replace('/', '');
        },
        error => {
          console.log('[ ROUTER STATE ERROR ]', error);
        }
      );
  }

  public menuClose = (element) => {
    element.close();
  }

  public navChange = (element?) => {
    const navHamburgerButton: HTMLElement = document.getElementById('nav-hamburger-button');
    if (element) {
      navHamburgerButton.style.display = 'none';
      setTimeout(() => {
        navHamburgerButton.style.opacity = '0';
        navHamburgerButton.style.display = 'block';
        navHamburgerButton.style.pointerEvents = 'none';
      }, 50);
    } else if (!element && navHamburgerButton) {
      navHamburgerButton.style.opacity = '1';
      navHamburgerButton.style.pointerEvents = 'auto';
    }
  }

  public logOut = (element) => {
    this.menuClose(element);
    this.authService.logout();
  }

}
