
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../public-api';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'lib-button-2',
  imports: [IconComponent, MatIconModule],
  templateUrl: './button-2.component.html',
  styleUrl: './button-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Button2Component {
  iconName = input<string>(); // Icono por defecto
  matIconName = input<string>(); // Icono por defecto
  //iconSize = input<string | number | undefined>();
  iconColor = input<string>('#FAFBFC') 
  tooltipText = input<string>();
  variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary'); // Tipo de botón por defecto
  size = input<'large' |'medium' |'small'>('medium');
  ariaLabel = input<string>('Botón de acción'); // Para accesibilidad
  disabled = input<boolean>(false); // Para deshabilitar el botón

  // Podrías añadir un @Output() si necesitas emitir un evento al hacer clic
  //  @Output() buttonClick = new EventEmitter<void>();
  //  onClick(Event: Event) {
  //   Event.stopPropagation();
  //    this.buttonClick.emit();
  //  }
}
