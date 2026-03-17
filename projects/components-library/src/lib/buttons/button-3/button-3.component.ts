
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-button-3',
  imports: [IconComponent, MatIconModule],
  standalone: true,
  templateUrl: './button-3.component.html',
  styleUrl: './button-3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button3Component {
  variant = input<'primary' | 'secondary' | 'light' | 'danger'>('primary');
  disabled = input<boolean>(false);
  size = input<'large' | 'medium' | 'small'>('medium');
  height = input<number | string | null>(null);
  width = input<number | string | null>(null);

  // --- Nuevas entradas para los iconos ---
  /** Nombre del icono personalizado (usa <lib-icon>) */
  iconName = input<string | undefined>();
  /** Nombre del icono de Material (usa <lib-mat-icon-2>) */
  matIconName = input<string | undefined>();
  /** Posición del icono */
  iconPosition = input<'left' | 'right'>('left');
  matIconColor = input<string>('#333')

  // Computed signal para los estilos dinámicos
  buttonStyles = computed(() => {
    const styles: { [key: string]: string } = {};

    const w = this.width();
    if (w !== null) {
      styles['width'] = typeof w === 'number' ? `${w}px` : w;
    }

    const h = this.height();
    if (h !== null) {
      styles['height'] = typeof h === 'number' ? `${h}px` : h;
    }

    return styles;
  });

  /** Determina si se debe mostrar un icono */
  hasIcon = computed(() => !!this.iconName() || !!this.matIconName());

  /** Calcula el tamaño del icono basado en el tamaño del botón */
  iconSize = computed(() => {
    switch (this.size()) {
      case 'large':
        return 24;
      case 'medium':
        return 20;
      case 'small':
        return 16;
      default:
        return 20;
    }
  });

  /**
   * Genera dinámicamente la lista de clases para el botón.
   * Es una práctica más limpia que la concatenación de strings en la plantilla.
   */
  buttonClasses = computed(() => {
    const classes = ['custom-button', this.variant(), this.size()];
    if (this.hasIcon()) {
      classes.push('with-icon', `icon-${this.iconPosition()}`);
    }
    return classes.join(' ');
  });

  /**
   * Convierte el valor de width a un string válido para CSS.
   * Prefiere el binding directo de estilo en la plantilla.
   */
  formattedWidth = computed(() => {
    const w = this.width();
    return w !== null ? (typeof w === 'number' ? `${w}px` : w) : null;
  });

  /**
   * Convierte el valor de height a un string válido para CSS.
   * Prefiere el binding directo de estilo en la plantilla.
   */
  formattedHeight = computed(() => {
    const h = this.height();
    return h !== null ? (typeof h === 'number' ? `${h}px` : h) : null;
  });
}
