import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatusConfig } from '../../../interfaces/status-config.interface';

@Component({
  selector: 'lib-stage-status-circle',
  standalone: true,
  imports: [],
  templateUrl: './stage-status-circle.component.html',
  styleUrl: './stage-status-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageStatusCircleComponent {
  status = input.required<StatusConfig>();
  size = input<number>(20); // Tamaño por defecto 20px
}