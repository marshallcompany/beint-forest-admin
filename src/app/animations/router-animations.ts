import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeAnimation =
  trigger('fadeAnimation', [
    state(
      'void',
      style({
        opacity: 0,
        transform: 'scale(0.8)'
      })
    ),
    state(
      'active',
      style({
        opacity: 1,
        transform: 'scale(1)'
      })
    ),
    state(
      'noActive',
      style({})
    ),
    transition('void => active', animate('.5s cubic-bezier(.42, .97, .52, 1.49)')),
    transition('* => void', animate('.5s cubic-bezier(.42, .97, .52, 1.49)'))
  ]);
// cubic-bezier(.42, .97, .52, 1.49)
