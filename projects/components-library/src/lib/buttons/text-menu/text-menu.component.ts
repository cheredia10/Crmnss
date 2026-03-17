import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';

export interface MenuItem {
  id: string | number;
  label: string;
  icon?: string;
  iconSvg?: string;
  disabled?: boolean;
  selected?: boolean;
  url?: string;
  data?: any;
}

@Component({
  selector: 'lib-text-menu',
  imports: [CommonModule, IconComponent],
  templateUrl: './text-menu.component.html',
  styleUrl: './text-menu.component.scss'
})
export class TextMenuComponent {
  // Inputs
  label = input<string>('');
  icon = input<string>('');
  iconSvg = input<string>('');
  disabled = input<boolean>(false);
  selected = input<boolean>(false);
  url = input<string>('');

  // Estado interno
  active = signal<boolean>(false);

  // Outputs
  itemClick = output<void>();

  // Métodos
  onClick(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }

  onMouseEnter(): void {
    if (!this.disabled()) {
      this.active.set(true);
    }
  }

  onMouseLeave(): void {
    this.active.set(false);
  }
}
