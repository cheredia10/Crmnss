import { Component, input } from '@angular/core';
import { IconComponent } from './icon.component';
import { MaterialIconComponent } from './material-icon.component';

@Component({
  selector: 'lib-dynamic-icon',
  standalone: true,
  imports: [IconComponent, MaterialIconComponent],
  template: `
    @if (matIcon(); as matIconName) {
      <lib-mat-icon-2 [name]="matIconName" [size]="size()" [color]="color()"/>
    } @else {
      @if (icon(); as iconName) {
        <lib-icon [name]="iconName" [size]="size()" [color]="color()"/>
      }
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DynamicIconComponent {
  icon = input<string>();
  matIcon = input<string>();
  size = input<number>(24);
  color = input<string>('currentColor');
}