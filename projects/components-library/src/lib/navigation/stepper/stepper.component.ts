import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StepStatus = 'done' | 'active' | 'inactive';

export interface StepperStep {
  number: number;
  status: StepStatus;
}

@Component({
  selector: 'lib-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  totalSteps = input<number>(4);
  currentStep = input<number>(1);

  steps = computed(() => {
    return Array.from({ length: this.totalSteps() }, (_, index) => {
      const stepNumber = index + 1;
      const current = this.currentStep();

      let status: StepStatus = 'inactive';
      if (stepNumber < current) {
        status = 'done';
      } else if (stepNumber === current) {
        status = 'active';
      }

      return { number: stepNumber, status };
    });
  });
}
