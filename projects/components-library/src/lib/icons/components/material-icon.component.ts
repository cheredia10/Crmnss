import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'lib-mat-icon-2',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <mat-icon 
      [fontIcon]="name()"
      [style.fontSize.px]="size()"
      [style.color]="color()"
      [style.width.px]="size()"
      [style.height.px]="size()">
    </mat-icon>
  `,
  styles: [`
    :host { display: inline-flex; }
    mat-icon { 
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class MaterialIconComponent {
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('currentColor');
}