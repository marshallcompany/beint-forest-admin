import {
  QueryList,
  Component,
  Input,
  ContentChildren,
  AfterViewInit,
} from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

export enum AccordionMode {
  Single = 'single',
  Multiple = 'multiple',
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'accordion',
  template: '<ng-content></ng-content>',
  styles: [`:host {
    display: block;
  }`]
})
export class AccordionComponent implements AfterViewInit {

  @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;
  @Input() mode: AccordionMode = AccordionMode.Multiple;

  openChild: AccordionItemComponent = null;

  ngAfterViewInit() {
    this.items.forEach(item => {
      item.toggleEmitter.subscribe(item => {
        this.expand(item);
      });
    });
  }

  expand(item: AccordionItemComponent) {
    if (item === this.openChild && item.expanded) {
      return item.close();
    }
    item.open();
    this.openChild = item;

    // Multiple mode, don't close others.
    if (this.mode === AccordionMode.Multiple) {
      return;
    }

    // Single mode, close others.
    this.items
      .filter(item => item !== this.openChild)
      .map(item => item.close());
  }
}
