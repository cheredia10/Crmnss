import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type StepStatus = 'active' | 'completed' | 'disabled' | 'pending';

export interface Step {
  id: string | number;
  label: string;
  status: StepStatus;
  number?: number;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-step-1',
  imports: [CommonModule],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss'
})
export class Step1Component {
  // Inputs
  steps = input<Step[]>([]);
  orientation = input<'vertical' | 'horizontal'>('vertical');
  clickable = input<boolean>(false);
  size = input<'small' | 'medium' | 'large'>('medium');

  // Outputs
  stepClick = output<{ step: Step; index: number }>();

  // Métodos
  onStepClick(step: Step, index: number): void {
    if (this.clickable() && !step.disabled && step.status !== 'disabled') {
      this.stepClick.emit({ step, index });
    }
  }
}
