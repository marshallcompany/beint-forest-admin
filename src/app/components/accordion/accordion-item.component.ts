import { Component, Output, EventEmitter } from '@angular/core';
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
  <div [@toggle]="expanded">
    <ng-content select=".accordion-content"></ng-content>
  </div>
  `,
  styles: [`:host {
    display: block;
  }`],
  animations: [
    trigger('toggle', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px', overflow: 'hidden' })),
      transition('false <=> true', animate('150ms linear'))
    ])
  ]
})
export class AccordionItemComponent {
  @Output() toggleEmitter: EventEmitter<any> = new EventEmitter<any>();
  expanded = false;

  onToggle() {
    this.toggleEmitter.next(this);
  }

  open() {
    this.expanded = !this.expanded;
  }

  close() {
    this.expanded = false;
  }
}
