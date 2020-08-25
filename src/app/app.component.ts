import { Component, OnInit} from '@angular/core';
import { TranslatesService } from './services/translates.service';


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

  constructor(
    private translatesService: TranslatesService
  ) {}

  ngOnInit() {
    this.translatesService.initLanguage();
  }

}
