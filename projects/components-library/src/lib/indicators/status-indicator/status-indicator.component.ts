import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

export interface StatusIndicatorConfig {
  label: string;
  color: string;
  borderColor?: string; // Color de borde opcional
}

@Component({
  selector: 'lib-status-indicator',
  standalone: true,
  imports: [],
  templateUrl: './status-indicator.component.html',
  styleUrl: './status-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorComponent {
  /**
   * Configuración del indicador de estado con label y color
   */
  config = input.required<StatusIndicatorConfig>();
  
  /**
   * Tamaño del círculo indicador en píxeles
   * Por defecto 24px como se ve en Figma
   */
  size = input<number>(24);

  /**
   * Computed que determina si el color es claro y necesita borde
   */
  needsBorder = computed(() => {
    const config = this.config();
    // Si ya tiene borderColor definido, usar ese
    if (config.borderColor !== undefined) {
      return !!config.borderColor;
    }
    
    // Auto-detectar colores claros que necesitan borde
    return this.isLightColor(config.color);
  });

  /**
   * Color del borde a usar
   */
  borderColor = computed(() => {
    const config = this.config();
    return config.borderColor || '#bbbfc1'; // Color por defecto de Figma
  });

  /**
   * Determina si un color es claro y necesita borde
   */
  private isLightColor(color: string): boolean {
    // Colores que consideramos claros y necesitan borde
    const lightColors = [
      '#ffffff', '#fff', 'white',
      '#f5f5f5', '#fafafa', '#f0f0f0',
      '#e0e0e0', '#eeeeee', '#f9f9f9'
    ];
    
    const lowerColor = color.toLowerCase();
    if (lightColors.includes(lowerColor)) {
      return true;
    }

    // Para colores hex, calcular luminancia
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      if (hex.length === 3 || hex.length === 6) {
        const r = parseInt(hex.substring(0, hex.length === 3 ? 1 : 2), 16);
        const g = parseInt(hex.substring(hex.length === 3 ? 1 : 2, hex.length === 3 ? 2 : 4), 16);
        const b = parseInt(hex.substring(hex.length === 3 ? 2 : 4), 16);
        
        // Si es hex corto, expandir (ej: #fff -> #ffffff)
        const rFull = hex.length === 3 ? r * 17 : r;
        const gFull = hex.length === 3 ? g * 17 : g;
        const bFull = hex.length === 3 ? b * 17 : b;
        
        // Calcular luminancia usando fórmula estándar
        const luminance = (0.299 * rFull + 0.587 * gFull + 0.114 * bFull) / 255;
        return luminance > 0.8; // Si es más del 80% claro, necesita borde
      }
    }

    return false;
  }
}