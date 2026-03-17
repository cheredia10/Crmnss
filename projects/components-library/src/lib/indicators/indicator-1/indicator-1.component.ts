import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export interface IndicatorData {
  id?: string | number;
  title: string;
  value: string | number;
  label?: string;
  color?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
  customColor?: string;
  icon?: string;
  iconSvg?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  clickable?: boolean;
}

@Component({
  selector: 'lib-indicator-1',
  imports: [CommonModule],
  templateUrl: './indicator-1.component.html',
  styleUrl: './indicator-1.component.scss'
})
export class Indicator1Component {
  // Inputs
  title = input<string>('');
  value = input<string | number>('');
  label = input<string>('Nº');
  color = input<'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary'>('primary');
  customColor = input<string>('');
  icon = input<string>('');
  iconSvg = input<string>('');
  trend = input<'up' | 'down' | 'neutral'>('neutral');
  trendValue = input<string>('');
  clickable = input<boolean>(false);

  // Color computado
  computedBackgroundColor = computed(() => {
    if (this.customColor()) {
      return this.customColor();
    }

    const colorMap = {
      success: '#9BDF86',    // Verde
      warning: '#FFC46B',    // Naranja
      danger: '#FF7466',     // Rojo
      info: '#64b5f6',       // Azul
      primary: '#7986cb',    // Púrpura
      secondary: '#a1a1a1'   // Gris
    };

    return colorMap[this.color()] || colorMap.primary;
  });

  // Métodos
  onClick(): void {
    if (this.clickable()) {
      // Emitir evento o manejar clic
      console.log('Indicator clicked:', this.title());
    }
  }

  getTrendIcon(): string {
    switch (this.trend()) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  }
}
