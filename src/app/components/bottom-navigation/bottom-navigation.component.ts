import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent implements OnInit {

  public activeRouter: string;

  constructor(
    public router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.checkRouterState();
  }

  private checkRouterState = () => {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(
        ({ urlAfterRedirects }: NavigationEnd) => {
          this.activeRouter = urlAfterRedirects;
        }
      );
  }

}
