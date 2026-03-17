import { ChangeDetectionStrategy, Component, effect, ElementRef, input, signal, ViewChild, inject, LOCALE_ID } from "@angular/core"
import { type FormControl, ReactiveFormsModule } from "@angular/forms"
import { IconComponent } from "../../../public-api"
import { DatePicker2Component } from "../date-picker-2/date-picker-2.component"
import { ScrollCloseDirective } from "../../../directives/scroll-close.directive"

@Component({
  selector: "lib-form-date-picker-2",
  imports: [ReactiveFormsModule, IconComponent, DatePicker2Component, ScrollCloseDirective],
  templateUrl: "./form-date-picker-2.component.html",
  styleUrl: "./form-date-picker-2.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDatePicker2Component {
  private elementRef = inject(ElementRef)
  private locale = inject(LOCALE_ID)

  @ViewChild("inputElement", { static: true }) inputElement!: ElementRef<HTMLInputElement>

  // Inputs
  placeholder = input<string>("Seleccionar fecha")
  control = input.required<FormControl<string | null>>()
  id = input.required<string>()
  inputWidth = input<string>("100%")
  inputHeight = input<string>("44px")    // Altura total del input incluyendo bordes
  disabled = input<boolean>(false)
  readonly = input<boolean>(false)
  minDate = input<Date | null>(null)
  maxDate = input<Date | null>(null)
  theme = input<"light" | "dark">("light")
  tabindex = input<number | undefined>(undefined)

  // --- ESTADO INTERNO SIMPLIFICADO ---
  // El estado interno se deriva del FormControl.
  readonly selectedDate = signal<Date | null>(null);
  readonly isCalendarOpen = signal(false);

  constructor() {
    // ==========================================================
    // --- ÚNICO EFFECT PARA SINCRONIZAR TODO ---
    // La fuente de verdad es el FormControl que viene de afuera.
    // ==========================================================
    effect(() => {
      const formValue = this.control().value; // Escuchamos el valor del control
      const parsedDate = this.parseDate(formValue); // Intentamos parsearlo

      // Actualizamos el 'selectedDate' interno que usa el calendario emergente
      this.selectedDate.set(parsedDate);
    });
  }

  // Se dispara cuando el calendario emergente (lib-date-picker-2) selecciona una fecha
  onDateSelectedFromCalendar(date: Date | null): void {
    if (date) {
      const formattedDate = this.formatDateForDisplay(date);
      // Actualizamos el FormControl, que es la fuente de verdad.
      this.control().setValue(formattedDate);
    } else {
      this.control().setValue(null);
    }
    // Cerramos el calendario
    this.isCalendarOpen.set(false);
  }

  private formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString(this.locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  private parseDate(dateString: string | null): Date | null {
    if (!dateString) return null;
    // Intenta varios formatos comunes
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY o D/M/YYYY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD o YYYY-M-D
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY o D-M-YYYY
    ]

    for (const format of formats) {
      const match = dateString.match(format)
      if (match) {
        let day: number, month: number, year: number

        if (format === formats[1]) {
          // YYYY-MM-DD
          ;[, year, month, day] = match.map(Number)
        } else {
          // DD/MM/YYYY or DD-MM-YYYY
          ;[, day, month, year] = match.map(Number)
        }

        const date = new Date(year, month - 1, day)

        // Verificar que la fecha es válida
        if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
          return date
        }
      }
    }

    // Fallback: intentar con Date constructor
    const fallbackDate = new Date(dateString)
    return isNaN(fallbackDate.getTime()) ? null : fallbackDate
  }

  toggleCalendar(): void {
    if (this.disabled() || this.readonly() || this.control().disabled) return
    this.isCalendarOpen.update((current) => !current)
  }


  // Comentado para evitar conflictos con selección del calendario
  // onInputBlur(): void {
  //   const formValue = this.control().value;
  //   const parsedDate = this.parseDate(formValue);
  //   // Volvemos a establecer el valor formateado para corregir la entrada del usuario.
  //   this.onDateSelectedFromCalendar(parsedDate);
  // }

  getTriggerElement(): HTMLElement {
    return this.elementRef.nativeElement.querySelector(".date-input-wrapper") as HTMLElement
  }

  // Método para cerrar el calendario al hacer scroll
  closeCalendar(): void {
    this.isCalendarOpen.set(false);
  }
}
