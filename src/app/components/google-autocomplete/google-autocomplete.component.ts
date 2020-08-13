import { Component, OnInit, NgZone, ViewChild, ElementRef, Output, EventEmitter, Input, SimpleChange, OnChanges } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { google } from 'google-maps';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AutocompleteDataService } from 'src/app/services/autocomplete-data.service';

@Component({
  selector: 'app-google-autocomplete',
  templateUrl: './google-autocomplete.component.html',
  styleUrls: ['./google-autocomplete.component.scss'],
})
export class GoogleAutocompleteComponent implements OnInit, OnChanges {

  @Input() adressType: string;
  @Input() validation: string;
  @Input() formControlValue: string;
  @Input() fieldStatus: string;
  @Input() fieldLabel: string;
  @Input() fieldPlaceholder: string;

  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  @ViewChild('container', { static: false }) container: ElementRef;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();

  public autocompleteData;
  public changesPacContainer = new BehaviorSubject(false);
  public location = new FormControl('');

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private autocompleteDataService: AutocompleteDataService,
  ) {

  }

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
          this.formControlValue = place.formatted_address;
          this.setInputValue(place);
          this.inputValidation(place);
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

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    this.location.setValue(this.formControlValue ? this.formControlValue : '');
  }

  setInputValue = (place) => {
    const zipCode = this.autocompleteDataService.getPostCode(place) ? this.autocompleteDataService.getPostCode(place) : '';
    const city = this.autocompleteDataService.getCity(place) ? this.autocompleteDataService.getCity(place) : '';
    const country = this.autocompleteDataService.getCountry(place) ? this.autocompleteDataService.getCountry(place) : '';
    let value: string;
    if (this.validation && this.validation === 'place/zipCode') {
      if (this.autocompleteDataService.getCity(place) && this.autocompleteDataService.getPostCode(place)) {
        value = zipCode + ` ` + city + `, ` + country;
        this.location.setValue(value);
      } else {
        this.location.setValue(place.formatted_address);
      }
    }
    if (this.validation && this.validation === 'place') {
      if (this.autocompleteDataService.getCity(place)) {
        value = city + `, ` + country;
        this.location.setValue(value);
      } else {
        this.location.setValue(place.formatted_address);
      }
    }
  }

  inputValidation = (place) => {
    // CHECK CITY AND ZIP CODE
    if (place && this.validation && this.validation === 'place/zipCode') {
      if (!this.autocompleteDataService.getCity(place)) {
        this.formControlValue = null;
      }
      if (!this.autocompleteDataService.getPostCode(place)) {
        this.formControlValue = null;
      }
    }
    // CHECK CITY
    if (place && this.validation && this.validation === 'place') {
      if (!this.autocompleteDataService.getCity(place)) {
        this.formControlValue = null;
      }
    }
  }

  checkInputValue = (ev) => {
    if (!ev.target.value.length) {
      this.formControlValue = null;
    }
  }

  checkChangeValue = (ev) => {
    if (!ev.target.value.length) {
      this.setAddress.emit('[NO VALUE]');
    }
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
