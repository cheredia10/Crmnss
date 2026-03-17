
import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { StatusType } from '../../../models/table-config.model';

// Definimos un tipo para mayor claridad
type StatusOptionConfig = { label: string; backgroundColor: string; textColor: string; };

@Component({
  selector: 'lib-table-status',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './table-status.component.html',
  styleUrl: './table-status.component.scss'
})
export class TableStatusComponent {
  // Signal inputs
  status = input.required<string>();
  options = input<Record<string, StatusOptionConfig>>({
    active: { label: 'Active', backgroundColor: 'rgba(159, 226, 138, 0.30)', textColor: '#1F7F13' },
    closed: { label: 'Closed', backgroundColor: 'rgba(255, 116, 102, 0.30)', textColor: '#B70100' },
    pending: { label: 'Pendiente', backgroundColor: 'rgba(255, 196, 107, 0.50)', textColor: '#FB8500' },
    na: { label: 'N.A.', backgroundColor: '#9e9e9e', textColor: '#000000' },
  });
  // --- NUEVO INPUT ---
  // Permite controlar si el menú de selección de estado se puede abrir.
  editable = input<boolean>(true);


  // Output as signal-based emitter
  statusChange = output<StatusType>();

  // --- INTERNAL STATE ---
  // Usamos un signal para el estado interno del menú.
  readonly showStatusMenu = signal(false);

  // --- COMPUTED SIGNALS (para valores derivados y robustez) ---

  // Opción de fallback para cuando un estado no se encuentra.
  private readonly fallbackOption: StatusOptionConfig = {
    label: 'N/A',
    backgroundColor: '#e0e0e0',
    textColor: '#616161'
  };

  // Signal computado para obtener la configuración del estado actual.
  // ¡Esta es la corrección principal!
  readonly currentOption = computed<StatusOptionConfig>(() => {
    const statusKey = (this.status() || '').toLowerCase();
    return this.options()[statusKey] ?? this.fallbackOption;
  });

  // Signal computado para la lista de opciones del menú.
  // Solo se recalcula si el input `options` cambia.
  readonly optionList = computed(() => {
    return Object.entries(this.options()).map(([value, data]) => ({
      value: value as StatusType,
      ...data
    }));
  });

  toggleStatusMenu(): void {
    if (this.editable()) {
      this.showStatusMenu.update(v => !v);
    }
  }

  selectStatus(newStatus: StatusType): void {
    this.statusChange.emit(newStatus);
    this.showStatusMenu.set(false);
  }

  // Usamos @HostListener para manejar el "click fuera". Es más declarativo que el host en el decorador.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Si el menú está abierto y el click fue fuera del componente, ciérralo.
    if (this.showStatusMenu() && !this.elRef.nativeElement.contains(event.target)) {
      this.showStatusMenu.set(false);
    }
  }

  // Inyectamos ElementRef para el HostListener.
  constructor(private elRef: ElementRef) { }
}
