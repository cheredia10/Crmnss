import { Component, input, output } from '@angular/core';
import { BreadcrumbStep } from '../breadcrumb-step/breadcrumb-step.component';
import { CommonModule } from '@angular/common';

export interface FlowStep extends BreadcrumbStep {
  x?: number;
  y?: number;
  connections?: string[]; // IDs de los steps conectados
}

@Component({
  selector: 'lib-step-flow',
  imports: [CommonModule],
  templateUrl: './step-flow.component.html',
  styleUrl: './step-flow.component.scss'
})
export class StepFlowComponent {
  // Inputs
  flowSteps = input<FlowStep[]>([]);
  size = input<'small' | 'medium' | 'large'>('medium');
  width = input<number>(600);
  height = input<number>(400);

  // Outputs
  stepClick = output<{ step: FlowStep; index: number }>();

  // Computed connections
  connections = input<any[]>([]);

  // Methods
  onStepClick(step: FlowStep, index: number): void {
    if (step.clickable && step.status !== 'disabled') {
      this.stepClick.emit({ step, index });
    }
  }

  getStepItemClasses(step: FlowStep): Record<string, boolean> {
    return {
      clickable: !!step.clickable && step.status !== 'disabled',
      ['status-' + step.status]: true,
      ['size-' + this.size()]: true
    };
  }

}
