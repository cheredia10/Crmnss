import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface TagData {
  id?: string | number;
  label: string;
  value: string | number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
  customColor?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'soft';
  icon?: string;
  iconSvg?: string;
  clickable?: boolean;
  removable?: boolean;
}

@Component({
  selector: 'lib-tag-1',
  imports: [CommonModule],
  templateUrl: './tag-1.component.html',
  styleUrl: './tag-1.component.scss'
})
export class Tag1Component {
  // Inputs
  label = input<string>('');
  value = input<string | number>('');
  color = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark'>('primary');
  customColor = input<string>('');
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'filled' | 'outlined' | 'soft'>('filled');
  icon = input<string>('');
  iconSvg = input<string>('');
  clickable = input<boolean>(false);
  removable = input<boolean>(false);

  // Outputs
  tagClick = output<void>();
  tagRemove = output<void>();

  // Colores computados
  computedBackgroundColor = computed(() => {
    if (this.customColor()) {
      return this.variant() === 'outlined' ? 'transparent' :
        this.variant() === 'soft' ? this.customColor() + '20' : this.customColor();
    }

    const colorMap = {
      primary: '#2196F3',    // Azul
      secondary: '#6c757d',  // Gris
      success: '#4caf50',    // Verde
      warning: '#ff9800',    // Naranja
      danger: '#f44336',     // Rojo
      info: '#00bcd4',       // Cian
      light: '#f8f9fa',      // Blanco
      dark: '#343a40'        // Negro
    };

    const baseColor = colorMap[this.color()];

    if (this.variant() === 'outlined') {
      return 'transparent';
    } else if (this.variant() === 'soft') {
      return baseColor + '20'; // 20% opacity
    }

    return baseColor;
  });

  computedTextColor = computed(() => {
    if (this.variant() === 'outlined' || this.variant() === 'soft') {
      return this.customColor() || this.getColorValue();
    }

    // Para variante filled, usar blanco excepto para light
    return this.color() === 'light' ? '#343a40' : '#ffffff';
  });

  computedBorderColor = computed(() => {
    if (this.variant() === 'outlined') {
      return this.customColor() || this.getColorValue();
    }
    return 'transparent';
  });

  // Métodos
  onClick(): void {
    if (this.clickable()) {
      this.tagClick.emit();
    }
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.tagRemove.emit();
  }

  private getColorValue(): string {
    const colorMap = {
      primary: '#2196F3',
      secondary: '#6c757d',
      success: '#4caf50',
      warning: '#ff9800',
      danger: '#f44336',
      info: '#00bcd4',
      light: '#f8f9fa',
      dark: '#343a40'
    };

    return colorMap[this.color()];
  }

  getClassObject() {
    return {
      clickable: this.clickable(),
      removable: this.removable(),
      ['size-' + this.size()]: true,
      ['variant-' + this.variant()]: true
    };
  }

}
