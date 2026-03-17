
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConfigurableStage } from '../../../interfaces/status-config.interface';

@Component({
  selector: 'lib-development-stage-tracker',
  standalone: true,
  imports: [],
  templateUrl: './development-stage-tracker.component.html',
  styleUrl: './development-stage-tracker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentStageTrackerComponent {
  stages = input.required<ConfigurableStage[]>();
}
