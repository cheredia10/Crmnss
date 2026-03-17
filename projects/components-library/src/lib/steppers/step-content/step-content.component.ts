import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-step-content',
  imports: [CommonModule],
  templateUrl: './step-content.component.html',
  styleUrl: './step-content.component.scss'
})
export class StepContentComponent {
  stepId = input<string>('');
  active = input<boolean>(false);
  height = input<string>('auto');
}