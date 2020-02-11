import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { filter } from 'rxjs/operators';

import { TranslatesService } from './services/translates.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public routerStatus: boolean;
  public activeRouter: string;
  private history = [];

  constructor(
    public router: Router,
    private translatesService: TranslatesService,
    private authService: AuthService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.translatesService.initLanguage();
    this.checkRouterState();

  }

  private checkRouterState = () => {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(
        ({ urlAfterRedirects }: NavigationEnd) => {
          this.activeRouter = urlAfterRedirects;
          this.history = [...this.history, urlAfterRedirects];
          const routerStateHistory = this.history[this.history.length - 2] || '/index';
          if (routerStateHistory === '/job-description' || routerStateHistory.includes('/apply/')) {
            this.routerStatus = true;
          } else {
            this.routerStatus = false;
          }
        }
      );
  }


  public goToComponent = (name: string) => {
    this.router.navigate([`${name}`]);
  }

}
