import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'primary';

@Component({
  selector: 'lib-status-button',
  imports: [CommonModule],
  templateUrl: './status-button.component.html',
  styleUrl: './status-button.component.scss'
})
export class StatusButtonComponent {
  // Inputs
  text = input<string>('');
  status = input<StatusType>('primary');
  disabled = input<boolean>(false);

  // Outputs
  buttonClick = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }
}
