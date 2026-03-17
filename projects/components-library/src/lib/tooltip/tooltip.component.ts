import { Component, input, signal } from '@angular/core';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'lib-tooltip',
  standalone: true,
  template: `
    <div 
      class="tooltip-container" 
      [class.dark]="dark()" 
      [class]="'position-' + position()"
    >
      {{ content() }}
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      z-index: 1000;
      pointer-events: none;
    }

    .tooltip-container {
      position: relative;
      padding: 8px 12px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      max-width: 200px;
      font-size: 14px;

      &::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
        transform: rotate(45deg);
      }

      &.position-top::before {
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      &.position-right::before {
        left: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      &.position-bottom::before {
        top: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      &.position-left::before {
        right: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      &.dark {
        background: #333;
        color: white;
      }
    }
  `]
})
export class TooltipComponent {
  content = signal<string>('');
  position = signal<TooltipPosition>('bottom');
  dark = signal<boolean>(false);

}