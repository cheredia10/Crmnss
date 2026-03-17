import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownOption, Select1Component } from '../../selects/select-1/select-1.component';
import { Button2Component } from '../../buttons/button-2/button-2.component';
import { IconComponent } from '../../../public-api';
import { StrengthItem } from '../../../interfaces/strength-item.interface';



@Component({
  selector: 'lib-panel-1',
  imports: [FormsModule, Select1Component, IconComponent, Button2Component],
  templateUrl: './panel-1.component.html',
  styleUrl: './panel-1.component.scss'
})
export class Panel1Component {
  // Inputs
  title = input<string>('Fortalezas');
  items = input.required<StrengthItem[]>();
  backgroundColor = input<string>('#d6e4f0'); // Color azul claro por defecto
  height = input<string>('auto');
  width = input<string>('100%');
  editable = input<boolean>(true);
  customId = input.required<string>();
  prefix = input<string>('F');
  tipo = input<'FODA' | 'PESTEL'>('FODA'); // Nuevo input para el tipo de panel
  startInEditMode = input<boolean>(false);

  // i18n: Textos configurables desde la app padre
  textPlaceholder = input<string>('Texto');
  impactLabel = input<string>('Impacto');
  urgencyPlaceholder = input<string>('Urgencia');
  deleteButtonTooltip = input<string>('Eliminar elemento');
  deleteButtonAriaLabel = input<string>('Eliminar elemento');
  addButtonTooltip = input<string>('Agregar nuevo elemento');
  addButtonAriaLabel = input<string>('Agregar nuevo elemento');
  editButtonAriaLabelPrefix = input<string>('Editar');
  urgencyShortLabelHigh = input<string>('Inmed.');
  urgencyShortLabelMedium = input<string>('Med.Plz');
  urgencyShortLabelLow = input<string>('Baja');

  // Outputs
  itemsChange = output<StrengthItem[]>();
  editRequested = output<string>(); // Emitirá el ID del panel que quiere ser editado

  // Estado interno
  editingItem = signal<StrengthItem | null>(null);
  newItemMode = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  
  // Para manejar items temporales que no se han guardado aún
  private originalItems = signal<StrengthItem[]>([]);
  
  // Items locales que incluyen los temporales (para mostrar en el formulario)
  private localItems = signal<StrengthItem[]>([]);
  
  // Computed que devuelve los items a mostrar (originales + temporales)
  displayItems = computed(() => {
    if (this.isEditing()) {
      return this.localItems();
    }
    return this.items();
  });

  // i18n: Opciones para dropdowns configurables desde la app padre
  impactOptions = input<DropdownOption[]>([
    { value: 'ALTO', label: 'Alto' },
    { value: 'MEDIO', label: 'Medio' },
    { value: 'BAJO', label: 'Bajo' }
  ]);

  urgencyOptions = input<DropdownOption[]>([
    { value: 'HIGH', label: 'Inmediata' },
    { value: 'MEDIUM', label: 'Mediano Plazo' },
    { value: 'LOW', label: 'Baja prioridad' }
  ]);

  constructor() {
    // Crea un 'effect' para reaccionar a los cambios del input.
    effect(() => {
      // Este código se ejecutará cada vez que 'startInEditMode' cambie.
      if (this.startInEditMode()) {
        this.isEditing.set(true);
        // Guardar copia original cuando entra en modo edición
        this.originalItems.set([...this.items()]);
        this.localItems.set([...this.items()]);
      }
    });

    // Effect para sincronizar items cuando no esté en modo edición
    effect(() => {
      if (!this.isEditing()) {
        this.localItems.set([...this.items()]);
      }
    });
  }

  // Métodos
  startNewItem() {
    const newItem = {
      id: this.generateId(),
      text: '',
      impact: '',
      urgency: ''
    };
    
    // Solo agregar al array local (no al original)
    const currentLocal = [...this.localItems()];
    currentLocal.push(newItem);
    this.localItems.set(currentLocal);
    
    // NO emitir el cambio inmediatamente - esperamos que el usuario escriba algo
  }

  editingMode() {
    // Guardar copia original antes de editar
    this.originalItems.set([...this.items()]);
    this.localItems.set([...this.items()]);
    this.editRequested.emit(this.customId()); // Notifica al padre
  }

  editItem(item: StrengthItem) {
    // Creamos una copia para no modificar el original directamente
    this.editingItem.set({ ...item });
    this.newItemMode.set(false);
  }

  // deleteItem(itemId: string) {
  //   const updatedItems = this.items().filter(item => item.id !== itemId);
  //   this.itemsChange.emit(updatedItems);
  // }

  saveItem() {
    if (!this.editingItem() || !this.editingItem()!.text.trim()) {
      return; // No guardamos si no hay texto
    }

    let updatedItems: StrengthItem[];

    if (this.newItemMode()) {
      // Agregar nuevo item
      updatedItems = [...this.items(), this.editingItem()!];
    } else {
      // Actualizar item existente
      updatedItems = this.items().map(item =>
        item.id === this.editingItem()!.id ? this.editingItem()! : item
      );
    }

    this.itemsChange.emit(updatedItems);
    //this.cancelEdit();
  }

  deleteItem(index: number) {
    const currentLocal = [...this.localItems()];
    currentLocal.splice(index, 1);
    this.localItems.set(currentLocal);
    this.itemsChange.emit(currentLocal);
  }

  getItemNumber(index: number): string {
    return `${this.prefix()}${index + 1}`;
  }

  getImpactLabel(value: string): string {
    const option = this.impactOptions().find(opt => opt.value === value);
    return option ? option.label : '';
  }

  getImpactClass(value: string): string {
    switch (value) {
      case 'ALTO': return 'impact-high';
      case 'MEDIO': return 'impact-medium';
      case 'BAJO': return 'impact-low';
      default: return '';
    }
  }

  getUrgencyClass(value: string | undefined): string {
    switch (value) {
      case 'HIGH': return 'urgency-high';    // Inmediata - rojo
      case 'MEDIUM': return 'urgency-medium'; // Mediano Plazo - naranja
      case 'LOW': return 'urgency-low';     // Baja prioridad - verde
      default: return '';
    }
  }

  getUrgencyShortLabel(value: string | undefined): string {
    switch (value) {
      case 'HIGH': return this.urgencyShortLabelHigh();
      case 'MEDIUM': return this.urgencyShortLabelMedium();
      case 'LOW': return this.urgencyShortLabelLow();
      default: return '';
    }
  }

  private generateId(): string {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  get editingItemNumber(): string {
    if (this.newItemMode()) {
      return this.prefix() + (this.displayItems().length);
    }
    const editing = this.editingItem();
    if (!editing) return '';
    const idx = this.displayItems().findIndex(i => i.id === editing.id);
    return this.prefix() + (idx + 1);
  }

  exportItem() {
    // Limpiar items vacíos antes de exportar
    const cleanedItems = this.localItems().filter(item => item.text && item.text.trim());
    this.localItems.set(cleanedItems);
    
    // Emitir los items locales limpios
    this.itemsChange.emit(cleanedItems);
  }

  // Método para restaurar los datos originales (para cancelar)
  restoreOriginalItems() {
    if (this.originalItems().length >= 0) {
      this.localItems.set([...this.originalItems()]);
      this.itemsChange.emit([...this.originalItems()]);
      this.originalItems.set([]);
    }
  }

  // Método para limpiar items vacíos (para cuando solo se escribió texto sin guardar)
  cleanEmptyItems() {
    const cleanedItems = this.items().filter(item => item.text && item.text.trim());
    if (cleanedItems.length !== this.items().length) {
      this.itemsChange.emit(cleanedItems);
    }
  }

  // Método que se llama cuando cambia el texto de un item
  onItemTextChange(item: StrengthItem) {
    // Si el item ahora tiene texto y antes no tenía, emitir cambios
    if (item.text && item.text.trim()) {
      // Solo emitir cuando hay texto real
      this.itemsChange.emit(this.localItems());
    }
  }

  // Método público para cancelar edición (llamado desde el padre)
  cancelEditing() {
    this.restoreOriginalItems();
    this.isEditing.set(false);
  }


}
