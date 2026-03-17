import {
  Component,
  ElementRef,
  HostBinding,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { ActionItem } from '../../../models/table-config.model';
import {
  DropdownMenuComponent,
  type DropdownMenuItem,
} from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'lib-table-actions',
  standalone: true,
  imports: [DropdownMenuComponent],
  templateUrl: './table-actions.component.html',
  styleUrl: './table-actions.component.scss',
})
export class TableActionsComponent {
  actions = input<ActionItem[]>([]);
  item = input<any>();
  position = input<'left' | 'right'>('right');

  actionClick = output<string>();

  private elementRef = inject(ElementRef);
  readonly isMenuOpen = signal(false);

  @HostBinding('class.menu-open')
  get menuOpenClass() {
    return this.isMenuOpen();
  }

  handleOpenState(isOpen: boolean): void {
    this.isMenuOpen.set(isOpen);

    // Añadir/quitar clase al td padre
    const tdElement = this.elementRef.nativeElement.closest('td');
    if (tdElement) {
      if (isOpen) {
        tdElement.classList.add('menu-open');
      } else {
        tdElement.classList.remove('menu-open');
      }
    }
  }

  get dropdownItems(): DropdownMenuItem[] {
    return this.getVisibleActions().map((action) => ({
      id: action.label.toLowerCase().replace(/\s+/g, '-'),
      label: action.label,
      icon: action.icon || this.mapActionToIcon(action.label), // Usar action.icon si está disponible
      disabled: this.isActionDisabled(action),
      action: () => {
        if (typeof action.action === 'function') {
          action.action(this.item());
        }
        this.actionClick.emit(action.label);
      },
    }));
  }

  private getVisibleActions(): ActionItem[] {
    return this.actions().filter((action) => {
      if (action.visible && typeof action.visible === 'function') {
        return action.visible(this.item());
      }
      return true;
    });
  }

  private isActionDisabled(action: ActionItem): boolean {
    if (action.disabled && typeof action.disabled === 'function') {
      return action.disabled(this.item());
    }
    return false;
  }

  private mapActionToIcon(actionLabel: string): string {
    const label = actionLabel.toLowerCase();

    const iconMap: { [key: string]: string } = {
      asignar: 'add-user',
      eliminar: 'trash-02',
      'eliminar documento': 'trash-02',
      editar: 'editar_blue',
      'ver detalles': 'fi-sr-eye',
      'ver documento': 'fi-sr-eye',
      'nuevo requisito': 'plus-01',
      'new requirement': 'plus-01',
      'cambiar etapa': 'editar_blue',
      'change stage': 'editar_blue',
      ver: 'view',
      detalles: 'view',
      details: 'view',
      descargar: 'download',
      copiar: 'copy',
      compartir: 'share',
      configurar: 'settings',
      configuración: 'settings',
      assign: 'assign',
      delete: 'trash-02',
      edit: 'editar_blue',
      view: 'view',
      'view details': 'fi-sr-eye',
      'view document': 'fi-sr-eye',
      download: 'download',
      copy: 'copy',
      share: 'share',
      settings: 'settings',
      configure: 'settings',
      seguimiento: 'clock-check',
      tracking: 'clock-check',
      kpi: 'fi-sr-chart-histogram',
      'validación final': 'file-check-02',
      'final validation': 'file-check-02',
      documentación: 'clock-forward',
      documentation: 'clock-forward',
      'cierre de la nc': 'checkbox-checked',
      'nc closure': 'checkbox-checked',
      informe: 'file-check-02',
      report: 'file-check-02',
      'nueva verificación': 'checkbox-checked',
      'new verification': 'checkbox-checked',
      'registro de liberación': 'file-check-02',
      'release registration': 'file-check-02',
      'enviar correo': 'mail',
      'redactar correo': 'mail',
      'send email': 'mail',
      'compose email': 'mail',
    };

    return iconMap[label] || 'view';
  }
}
