import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Indicator1Component, IndicatorData } from '../indicator-1/indicator-1.component';

@Component({
  selector: 'lib-indicator-grid-container',
  imports: [CommonModule, Indicator1Component],
  templateUrl: './indicator-grid-container.component.html',
  styleUrl: './indicator-grid-container.component.scss'
})
export class IndicatorGridContainerComponent {
  // Inputs
  indicators = input<IndicatorData[]>([]);
  columns = input<number>(3);
  gap = input<string>('16px');
  responsive = input<boolean>(true);

  // Outputs
  indicatorClick = output<{ indicator: IndicatorData; index: number }>();

  // Computed
  gridClass = input<string>('');

  // Métodos
  onIndicatorClick(indicator: IndicatorData, index: number): void {
    if (indicator.clickable) {
      this.indicatorClick.emit({ indicator, index });
    }
  }
}
