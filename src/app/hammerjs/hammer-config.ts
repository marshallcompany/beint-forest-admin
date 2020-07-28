import { Injectable, NgModule } from '@angular/core';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@Injectable()

@NgModule({
  declarations: [],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ]
})

export class HammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    return new Hammer.Manager(element, {
      touchAction: 'auto',
      inputClass: Hammer.TouchInput,
      recognizers: [
        [Hammer.Swipe, {
          direction: Hammer.DIRECTION_ALL
        }]
      ]
    });
  }
}

