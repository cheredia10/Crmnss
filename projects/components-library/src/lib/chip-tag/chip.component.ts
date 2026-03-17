import { Component, input, output } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-chip',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './chip.component.html', // Usaremos un archivo separado para más claridad
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
  label = input.required<string>();
  icon = input<string>();
  showCloseButton = input<boolean>(false);
  imageUrl = input<string>();
  type = input<'outline' | 'filled'>('filled'); // Cambiado a 'filled' por defecto para que coincida con el diseño

  // --- AÑADIR ESTO ---
  // Output que emite cuando el botón de cierre es presionado.
  closed = output<void>();

  // --- AÑADIR ESTO ---
  // Método que se llama desde la plantilla al hacer clic.
  onCloseClick(event: MouseEvent): void {
    // Detiene la propagación para evitar que otros clics (ej. en el modal) se disparen.
    event.stopPropagation();
    this.closed.emit();
  }
}