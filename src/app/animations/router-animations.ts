import { trigger, animate, transition, style, query } from '@angular/animations';

export const fadeAnimation =

  trigger('fadeAnimation', [

    transition('* => *', [

      query(':enter',
        [
          style({ opacity: 0, transform: 'scale(.8)' })
        ],
        { optional: true }
      ),

      query(':leave',
        [
          style({ opacity: 1, transform: 'scale(1)' }),
          animate('.5s cubic-bezier(.42, .97, .52, 1.49)', style({ opacity: 0, transform: 'scale(.8)' }))
        ],
        { optional: true }
      ),

      query(':enter',
        [
          style({ opacity: 0, transform: 'scale(.8)' }),
          animate('.5s cubic-bezier(.42, .97, .52, 1.49)', style({ opacity: 1, transform: 'scale(1)' }))
        ],
        { optional: true }
      )

    ])

  ]);
// cubic-bezier(.42, .97, .52, 1.49)
