import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-header-1',
  imports: [],
  templateUrl: './header-1.component.html',
  styleUrl: './header-1.component.scss'
})
export class Header1Component {

  text = input<string>('');
  size = input<'small'|'medium'|'large'>('medium');
  variant = input<'primary'|'secondary'|'danger'>('primary');
  width = input<string>('100%');
}