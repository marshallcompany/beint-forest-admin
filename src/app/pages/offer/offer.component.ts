import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  public detalOffer: object;
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

  @ViewChild('scrollToTop') scrollToTop;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.scrollToTop.nativeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    this.init();
  }

  public init = () => {
    const urlParam = this.route.snapshot.paramMap.get('jobId');
    this.detalOffer = this.acord[Number(urlParam) - 1];
  }
  public apply = () => {
    this.router.navigate(['/offer-thanks']);
  }

  public goToHome = () => {
    this.router.navigate(['/home']);
  }

}
