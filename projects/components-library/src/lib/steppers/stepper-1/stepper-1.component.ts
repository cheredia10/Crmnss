import { Component, input, output } from '@angular/core';
import { NavigationStep } from '../../../interfaces/stepper-step.interface';

@Component({
  selector: 'lib-stepper-1',
  imports: [],
  templateUrl: './stepper-1.component.html',
  styleUrl: './stepper-1.component.scss'
})
export class Stepper1Component {
  steps = input<NavigationStep[]>([]);
  showDivider = input<boolean>(true);

  stepClick = output<string>();

  onStepClick(stepId: string, status: string): void {
    // Solo permite navegación en steps completados y activo
    if (status === 'completed' || status === 'active') {
      this.stepClick.emit(stepId);
    }
  }

  getStepClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'step-completed';
      case 'active':
        return 'step-active';
      case 'pending':
      default:
        return 'step-pending';
    }
  }

  isClickable(status: string): boolean {
    return status === 'completed' || status === 'active';
  }
}