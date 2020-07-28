import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'accordion-item',
  template: `
  <div (click)="onToggle()">
    <ng-content select=".accordion-header"></ng-content>
  </div>
  <div class="accordion-content-wrapper"  #accordionContent [@toggle]="expanded">
    <ng-content select=".accordion-content"></ng-content>
  </div>
  `,
  styles: [`:host {
    display: block;
  }
  .accordion-content-wrapper{
    overflow: hidden;
  }`],
  animations: [
    trigger('toggle', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px'})),
      transition('false <=> true', animate('.25s linear'))
    ])
  ]
})
export class AccordionItemComponent {
  @ViewChild('accordionContent', { static: false }) accordionContent: ElementRef;
  @Output() toggleEmitter: EventEmitter<any> = new EventEmitter<any>();
  expanded = false;

  onToggle() {
    this.toggleEmitter.next(this);
    if (this.expanded) {
      setTimeout(() => {
        this.accordionContent.nativeElement.style.overflow = 'visible';
      }, 250);
    } else {
      this.accordionContent.nativeElement.style.overflow = 'hidden';
    }
  }

  open() {
    this.expanded = !this.expanded;
  }

  close() {
    this.expanded = false;
  }
}
