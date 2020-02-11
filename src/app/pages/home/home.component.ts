import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService, Profile } from '../../services/profile.service';
import { GlobalErrorService } from 'src/app/services/global-error-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user: Profile;
  public acord: Array<any> = [
    {
      title: 'Front-end Developer',
      category: 'Development',
      id: '1'
    },
    {
      title: 'Back-end Developer',
      category: 'Development',
      id: '2'
    }
  ];
  constructor(
    private router: Router,
    private profileService: ProfileService,
    private globalErrorService: GlobalErrorService
  ) {
  }

  ngOnInit() {
    this.init();
  }

  private init = () => {
    this.profileService.getProfile()
      .pipe()
      .subscribe(
        data => {
          this.user = data;
          console.log('[ USER DATA ]', this.user);
        },
        err => {
          this.globalErrorService.handleError(err);
          console.log('[ ERROR USER DATA ]', err);
        },
        () => console.log('[ USER DATA DONE ]')
      );
  }

  public goToProfile = () => {
    this.router.navigate(['/profile']);
  }
  public offer = (id) => {
    this.router.navigate([`/offer/${id}`]);
  }

  public openGroup = (e) => {
    e.classList.add('acord-active');
  }

  public closeGroup = (e) => {
    e.classList.remove('acord-active');
  }

  goToApply() {
    this.router.navigate(['apply-thanks']);
  }

}
