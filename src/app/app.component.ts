import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Router, NavigationEnd } from '@angular/router';
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
    private translateService: TranslateService,
    private authService: AuthService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.setLanguage();
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

  private setLanguage = () => {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.addLangs(['en', 'de']);
    this.translateService.setDefaultLang('en');
    this.translateService.use(browserLang.match(/en|ru|de/) ? browserLang : 'en');
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
