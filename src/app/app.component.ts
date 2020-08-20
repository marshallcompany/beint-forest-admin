import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { filter } from 'rxjs/operators';
import { TranslatesService } from './services/translates.service';
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

  constructor() {}

  ngOnInit() {
  }

}
