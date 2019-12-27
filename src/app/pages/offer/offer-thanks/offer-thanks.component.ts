import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-thanks',
  templateUrl: './offer-thanks.component.html',
  styleUrls: ['./offer-thanks.component.scss']
})
export class OfferThanksComponent implements OnInit {

  @ViewChild('scrollToTop') scrollToTop;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.scrollToTop.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }


  public goToHome = () => {
    this.router.navigate(['/home']);
  }

  public goToProfile = () => {
    this.router.navigate(['/profile']);
  }

}
