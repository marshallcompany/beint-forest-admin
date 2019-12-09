import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.setLanguage();
  }

  private setLanguage = () => {
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.addLangs(['en', 'de']);
    this.translateService.setDefaultLang('en');
    this.translateService.use(browserLang.match(/en|ru|de/) ? browserLang : 'en');
  }

}
