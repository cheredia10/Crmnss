import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type StatusIconType = 'info' | 'success' | 'warning' | 'error' | 'neutral';

@Component({
  selector: 'lib-bullet-1',
  imports: [CommonModule],
  templateUrl: './bullet-1.component.html',
  styleUrl: './bullet-1.component.scss'
})
export class Bullet1Component {
  // Inputs
  text = input<string>('');
  iconType = input<StatusIconType>('info');
  iconText = input<string>('');
  clickable = input<boolean>(false);

  // Outputs
  itemClick = output<void>();

  getIconText(): string {
    if (this.iconText()) {
      return this.iconText();
    }

    switch (this.iconType()) {
      case 'info': return 'i';
      case 'success': return '✓';
      case 'warning': return '!';
      case 'error': return '✕';
      default: return '•';
    }
  }

  onClick(): void {
    if (this.clickable()) {
      this.itemClick.emit();
    }
  }
}
