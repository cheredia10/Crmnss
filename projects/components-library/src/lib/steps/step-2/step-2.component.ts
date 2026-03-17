import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type StepStatus = 'active' | 'completed' | 'disabled' | 'pending';

@Component({
  selector: 'lib-step-2',
  imports: [CommonModule],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss'
})
export class Step2Component {
  // Inputs
  label = input<string>('');
  number = input<number | string>(1);
  status = input<StepStatus>('pending');
  icon = input<string>('');
  clickable = input<boolean>(false);
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs
  stepClick = output<void>();

  onClick(): void {
    if (this.clickable() && this.status() !== 'disabled') {
      this.stepClick.emit();
    }
  }
}
