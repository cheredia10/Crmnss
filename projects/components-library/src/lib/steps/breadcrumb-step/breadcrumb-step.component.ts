import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type StepStatus = 'completed' | 'active' | 'disabled' | 'pending';
export type StepSize = 'small' | 'medium' | 'large';

export interface BreadcrumbStep {
  id: string | number;
  label: string;
  status: StepStatus;
  icon?: string;
  iconSvg?: string;
  clickable?: boolean;
  description?: string;
}

@Component({
  selector: 'lib-breadcrumb-step',
  imports: [CommonModule],
  templateUrl: './breadcrumb-step.component.html',
  styleUrl: './breadcrumb-step.component.scss'
})
export class BreadcrumbStepComponent {
  // Inputs
  steps = input<BreadcrumbStep[]>([]);
  size = input<StepSize>('medium');
  showConnectors = input<boolean>(true);
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  // Outputs
  stepClick = output<{ step: BreadcrumbStep; index: number }>();

  // Methods
  onStepClick(step: BreadcrumbStep, index: number): void {
    if (step.clickable && step.status !== 'disabled') {
      this.stepClick.emit({ step, index });
    }
  }

  getConnectorStatus(currentIndex: number): StepStatus {
    const currentStep = this.steps()[currentIndex];
    const nextStep = this.steps()[currentIndex + 1];

    if (currentStep.status === 'completed') {
      return 'completed';
    } else if (currentStep.status === 'active' || nextStep?.status === 'active') {
      return 'active';
    } else if (currentStep.status === 'pending') {
      return 'pending';
    }

    return 'disabled';
  }

  getStepItemClasses(step: BreadcrumbStep): Record<string, boolean> {
    return {
      clickable: !!step.clickable && step.status !== 'disabled',
      ['status-' + step.status]: true
    };
  }

  getConnectorClasses(index: number): Record<string, boolean> {
    const status = this.getConnectorStatus(index);
    return {
      ['connector-' + status]: true
    };
  }
  
  
}
