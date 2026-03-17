import { Component, input, output, model, forwardRef, ChangeDetectionStrategy, signal, computed, effect, inject, DestroyRef, ElementRef, ViewChild } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, FormControl } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { ScrollCloseDirective } from '../../../directives/scroll-close.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface DropdownOption2 {
  value: any;
  label: string;
}

// --> NUEVO: Usaremos un valor único para identificar la opción de "Añadir nuevo"
const ADD_NEW_OPTION_VALUE = Symbol('ADD_NEW_OPTION');

@Component({
  selector: 'lib-select-2',
  standalone: true,
  imports: [ClickOutsideDirective, ScrollCloseDirective, FormsModule],
  templateUrl: './select-2.component.html',
  styleUrl: './select-2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Encapsulation.None puede ser útil si los estilos de "click-outside" necesitan ser globales
  // encapsulation: ViewEncapsulation.None, 
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select2Component),
      multi: true
    }
  ]
})
export class Select2Component implements ControlValueAccessor {
  private readonly destroyRef = inject(DestroyRef); // Inyectamos DestroyRef
  private readonly elementRef = inject(ElementRef);

  @ViewChild('dropdownMenu', { static: false }) dropdownMenu!: ElementRef;
  // --> NUEVO: Referencia al input para poder hacer focus en él
  @ViewChild('newInput', { static: false }) newInput!: ElementRef<HTMLInputElement>;

  // --- Inputs ---
  options = input.required<DropdownOption2[]>();
  placeholder = input<string>('Seleccionar');
  id = input<string>();
  width = input<string>('100%');
  inputHeight = input<string>('auto');    // Altura total del select, 'auto' mantiene la altura natural actual

  // --- INPUTS RESTAURADOS (ya estaban, solo confirmando) ---
  label = input<string>();
  customClass = input<string>();

  // --- ¡NUEVO INPUT PARA EL CONTROL! ---
  // Este input es opcional. Si se proporciona, tomará precedencia.
  control = input<FormControl | undefined>(undefined);

  // --> NUEVO: Inputs para la funcionalidad de añadir nuevo elemento
  allowAddNew = input<boolean>(false);
  addNewLabel = input<string>('Añadir nuevo...');

  // --> NUEVO: Output para notificar al componente padre que se debe crear un nuevo item
  addNewItem = output<string>();

  // --- State Signals ---
  isOpen = signal(false);
  isInDialog = signal<boolean>(false);

  // El valor puede ser controlado externamente (vía CVA o [control])
  // o internamente.
  value = model<any>(null);

  // El estado de deshabilitado ahora es un signal simple.
  isDisabled = signal(false);

  // --> NUEVO: Signals para gestionar el estado de "añadir nuevo"
  isAddingNew = signal(false);
  newInputValue = signal('');

  // Signal to track control status changes for error detection
  private controlStatusTrigger = signal(0);

  // Track control state for validation display
  private lastControlState = signal<{ touched: boolean, dirty: boolean, invalid: boolean } | null>(null);

  // `computed` para derivar el label seleccionado
  selectedLabel = computed(() => {
    const selectedOption = this.options().find(o => o.value === this.value());
    return selectedOption?.label ?? '';
  });

  // --> NUEVO: Computed signal que añade la opción "Añadir nuevo" si está permitido
  displayedOptions = computed<DropdownOption2[]>(() => {
    if (this.allowAddNew()) {
      return [
        { value: ADD_NEW_OPTION_VALUE, label: this.addNewLabel() },
        ...this.options()
      ];
    }
    return this.options();
  });

  // `computed` para detectar errores de validación
  hasError = computed(() => {
    const ctrl = this.control();
    if (!ctrl) return false;

    // Include the trigger signal to force re-computation when control state changes
    this.controlStatusTrigger();

    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  });

  // Callbacks para ControlValueAccessor
  #onChange: (value: any) => void = () => { };
  #onTouched: () => void = () => { };

  constructor() {
    // Sincroniza el model() con el CVA onChange
    effect(() => {
      this.#onChange(this.value());
    });

    // --> NUEVO: Effect para hacer focus en el input cuando aparezca
    effect(() => {
      if (this.isAddingNew() && this.newInput) {
        // Usamos un pequeño timeout para asegurar que el elemento sea visible en el DOM
        setTimeout(() => this.newInput.nativeElement.focus(), 0);
      }
    });

    // --- LÓGICA MOVIDA AL CONSTRUCTOR ---
    // Usamos un effect para reaccionar cuando el `control` input cambia.
    effect(() => {
      const externalControl = this.control();
      if (externalControl) {
        // --- MODO [control] ---

        // 1. Sincronizamos el valor del control externo con nuestro valor interno
        externalControl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef)) // Pasamos el DestroyRef explícitamente
          .subscribe(newValue => {
            this.value.set(newValue);
          });

        // 2. Sincronizamos el estado de deshabilitado y otros cambios de estado
        externalControl.statusChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.isDisabled.set(externalControl.disabled);
            // Trigger re-computation of hasError when control state changes
            this.controlStatusTrigger.update(v => v + 1);
          });

        // 3. Establecemos los valores iniciales
        this.value.set(externalControl.value);
        this.isDisabled.set(externalControl.disabled);

        // 4. Set initial control state
        this.lastControlState.set({
          touched: externalControl.touched,
          dirty: externalControl.dirty,
          invalid: externalControl.invalid
        });
      }
    });
  }

  toggleDropdown(): void {
    // --> NUEVO: No abrir si estamos en modo "añadir"
    if (this.isDisabled() || this.isAddingNew()) return;
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.#onTouched();
      const ctrl = this.control();
      if (ctrl) {
        ctrl.markAsTouched();
        this.lastControlState.set({
          touched: true,
          dirty: ctrl.dirty,
          invalid: ctrl.invalid
        });
        this.controlStatusTrigger.update(v => v + 1);
      }
      setTimeout(() => this.calculatePosition(), 0);
    }
  }

  closeDropdown(): void {
    // --> NUEVO: Si cerramos el dropdown, también cancelamos el modo "añadir"
    if (this.isAddingNew()) {
      this.cancelAddNew();
    }
    this.isOpen.set(false);
  }

  selectOption(option: DropdownOption2, event: Event): void {
    event.stopPropagation();

    // --> NUEVO: Lógica para manejar la opción "Añadir nuevo"
    if (option.value === ADD_NEW_OPTION_VALUE) {
      this.isAddingNew.set(true);
      this.isOpen.set(false); // Cerramos el menú para mostrar el input
      return;
    }

    // Al seleccionar una opción, actualizamos tanto el control externo (si existe)
    // como nuestro `model` interno.
    const ctrl = this.control();
    if (ctrl) {
      ctrl.setValue(option.value);
      ctrl.markAsDirty();
      // Update control state tracking when value changes
      this.lastControlState.set({
        touched: ctrl.touched,
        dirty: true,
        invalid: ctrl.invalid
      });
      this.controlStatusTrigger.update(v => v + 1);
    }
    this.value.set(option.value);

    this.closeDropdown();
  }

  // --> NUEVO: Métodos para manejar el input de nuevo valor
  handleNewInput(): void {
    const newValue = this.newInputValue().trim();
    if (newValue) {
      this.addNewItem.emit(newValue);
      // Opcional: podrías querer seleccionar el nuevo valor si el padre lo devuelve.
      // Por ahora, solo cerramos el modo de edición.
    }
    this.isAddingNew.set(false);
    this.newInputValue.set('');
  }

  cancelAddNew(): void {
    this.isAddingNew.set(false);
    this.newInputValue.set('');
  }


  // --- CVA Methods ---
  // Estos métodos se usarán cuando [control] NO se proporcione.
  writeValue(value: any): void {
    this.value.set(value);
  }

  registerOnChange(fn: any): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private calculatePosition(): void {
    if (!this.dropdownMenu || !this.dropdownMenu.nativeElement) return;

    // Detectar si estamos dentro de un diálogo
    this.detectDialogContext();

    const containerElement = this.elementRef.nativeElement.querySelector('.dropdown-container') as HTMLElement;
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const dropdownHeight = 200; // Altura aproximada del dropdown
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - containerRect.bottom;

    // Si estamos en un diálogo, usar posicionamiento fixed
    if (this.isInDialog()) {
      this.positionDropdownInDialog(containerRect, dropdownHeight, viewportHeight);
    }
  }

  private detectDialogContext(): void {
    // Buscar si hay un elemento con clases de diálogo Material o modal en los ancestros
    let element = this.elementRef.nativeElement as HTMLElement;
    while (element && element !== document.body) {
      const classList = element.classList;
      if (
        classList.contains('mat-mdc-dialog-container') ||
        classList.contains('cdk-dialog-container') ||
        classList.contains('modal') ||
        classList.contains('dialog-content') ||
        classList.contains('process-modal-panel')
      ) {
        this.isInDialog.set(true);
        return;
      }
      element = element.parentElement!;
    }
    this.isInDialog.set(false);
  }

  private positionDropdownInDialog(containerRect: DOMRect, dropdownHeight: number, viewportHeight: number): void {
    const dropdown = this.dropdownMenu.nativeElement as HTMLElement;

    // Buscar el contenedor del modal para calcular espacio disponible
    let dialogContainer = this.elementRef.nativeElement as HTMLElement;
    while (dialogContainer && dialogContainer !== document.body) {
      const classList = dialogContainer.classList;
      if (
        classList.contains('mat-mdc-dialog-container') ||
        classList.contains('cdk-dialog-container') ||
        classList.contains('process-modal-panel') ||
        classList.contains('dialog-content')
      ) {
        break;
      }
      dialogContainer = dialogContainer.parentElement!;
    }

    // Calcular altura real del dropdown basada en opciones
    const optionsCount = this.options().length;
    const actualDropdownHeight = Math.min(optionsCount * 40 + 16, 200); // 40px por opción + padding, máximo 200px

    const margin = 4;
    let spaceBelow: number;
    let spaceAbove: number;

    if (dialogContainer && dialogContainer !== document.body) {
      // Usar límites del modal en lugar del viewport
      const modalRect = dialogContainer.getBoundingClientRect();
      spaceBelow = modalRect.bottom - containerRect.bottom - 20; // 20px margen del modal
      spaceAbove = containerRect.top - modalRect.top - 20;
    } else {
      // Fallback al viewport si no encuentra el modal
      spaceBelow = viewportHeight - containerRect.bottom;
      spaceAbove = containerRect.top;
    }

    // Decidir posicionamiento basado en espacio real disponible
    if (spaceBelow < actualDropdownHeight && spaceAbove > actualDropdownHeight) {
      // Mostrar arriba
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${containerRect.top - margin}px`;
      dropdown.style.left = `${containerRect.left}px`;
      dropdown.style.width = `${containerRect.width}px`;
      dropdown.style.zIndex = '10000';
      dropdown.style.transform = 'translateY(-100%)';
      dropdown.style.maxHeight = `${Math.min(actualDropdownHeight, spaceAbove)}px`;
    } else {
      // Mostrar abajo
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${containerRect.bottom + margin}px`;
      dropdown.style.left = `${containerRect.left}px`;
      dropdown.style.width = `${containerRect.width}px`;
      dropdown.style.zIndex = '10000';
      dropdown.style.transform = 'none';
      dropdown.style.maxHeight = `${Math.min(actualDropdownHeight, spaceBelow)}px`;
    }
  }
}
