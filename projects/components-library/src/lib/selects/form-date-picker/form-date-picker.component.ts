import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../../public-api'; // Ajusta la ruta si es necesario
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'lib-form-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent, DatePickerComponent],
  templateUrl: './form-date-picker.component.html',
  styleUrl: './form-date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDatePickerComponent {
  // --- Inputs ---
  placeholder = input<string>('');
  control = input.required<FormControl<string | null>>();
  id = input.required<string>();
  inputWidth = input<string>('100%');

  // --- Estado Interno ---
  selectedDate = signal<Date | null>(null);
  isCalendarOpen = signal(false);

  constructor() {
    // EFECTO 1: Sincroniza la fecha seleccionada (componente) HACIA el FormControl (formulario).
    effect(() => {
      const date = this.selectedDate();
      const formControl = this.control();

      // Solo actualiza si hay una fecha y el valor del control es diferente
      // para evitar actualizaciones innecesarias.
      if (date) {
        const formattedDate = date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        if (formControl.value !== formattedDate) {
          formControl.setValue(formattedDate, { emitEvent: false });
        }
      }
    });

    // EFECTO 2: Sincroniza el valor del FormControl (formulario) HACIA el componente.
    // Esto es útil para establecer el valor inicial si el formulario ya tiene uno.
    effect(() => {
      const formControlValue = this.control().value;
      if (formControlValue && typeof formControlValue === 'string') {
        const parsedDate = new Date(formControlValue);
        // Comprueba si es una fecha válida y si es diferente de la que ya tenemos.
        if (!isNaN(parsedDate.getTime()) && parsedDate.getTime() !== this.selectedDate()?.getTime()) {
          this.selectedDate.set(parsedDate);
        }
      }
    });

    // El bloque que causaba el error ha sido eliminado.
    // El constructor ahora solo registra los efectos.
  }

  // Método para abrir/cerrar el calendario.
  toggleCalendar(): void {
    this.isCalendarOpen.update(currentValue => !currentValue);
  }
}