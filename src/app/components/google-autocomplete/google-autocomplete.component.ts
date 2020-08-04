import { Component, OnInit, NgZone, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { google } from 'google-maps';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-google-autocomplete',
  templateUrl: './google-autocomplete.component.html',
  styleUrls: ['./google-autocomplete.component.scss'],
})
export class GoogleAutocompleteComponent implements OnInit {

  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  @ViewChild('container', { static: false }) container: ElementRef;
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();

  public autocompleteData;
  public changesPacContainer = new BehaviorSubject(false);

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: [this.adressType]
      });
      this.autocompleteData = autocomplete;
      this.changesPacContainer.next(autocomplete ? true : false);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.setAddress.emit(place);
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
    this.changesPacContainer
    .pipe(
      delay(1000)
    )
    .subscribe(
      res => {
        if (res) {
          this.container.nativeElement.appendChild(this.getAutocompletePacContainer(this.autocompleteData));
        }
      }
    );
  }

  getAutocompletePacContainer(autocomplete) {
    const place = autocomplete.gm_accessors_.place;
    const placeKey = Object.keys(place).find((value) => (
      (typeof (place[value]) === 'object') && (place[value].hasOwnProperty('gm_accessors_'))
    ));
    const input = place[placeKey].gm_accessors_.input[placeKey];
    const inputKey = Object.keys(input).find((value) => (
      (input[value].classList && input[value].classList.contains('pac-container'))
    ));
    return input[inputKey];
  }

}
