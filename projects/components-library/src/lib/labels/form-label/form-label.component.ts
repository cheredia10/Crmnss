import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icons/components/icon.component';
import { TooltipDirective } from '../../tooltip/tooltip.directive';

@Component({
  selector: 'lib-form-label',
  imports: [CommonModule, IconComponent, TooltipDirective],
  standalone: true,
  templateUrl: './form-label.component.html',
  styleUrl: './form-label.component.scss'
})
export class FormLabelComponent {
  forId = input.required<string>();
  text = input.required<string>();
  required = input<boolean>(false);
  width = input<string>('auto'); // puedes pasar '100px', '20%', etc.
  
  // Nuevos inputs para ícono de información
  showInfoIcon = input<boolean>(false);
  infoTooltip = input<string>('');
  infoIconName = input<string>('info');
  
  // Inputs para configurar tooltip
  tooltipPosition = input<'top' | 'bottom' | 'left' | 'right'>('bottom');
  tooltipTheme = input<'normal' | 'dark'>('normal');
  
  // Output para eventos de ícono de información
  infoClick = output<void>();
  
  // Método para manejar click en ícono de información
  onInfoClick(): void {
    this.infoClick.emit();
  }
}
