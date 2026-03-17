
import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-form-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': 'hostWidth()',
    // Hacemos que el host se comporte como un bloque para que el ancho funcione correctamente
    'style': 'display: block; max-width: 100%;'
  }
})
export class FormTextareaComponent {
  control = input.required<FormControl<string | null>>();
  id = input.required<string>();
  placeholder = input('Escriba su texto...');
  // Nuevo input para la altura. Es más explícito y flexible que `rows`.
  height = input<string>('120px');
  // Renombramos inputWidth a hostWidth para mayor claridad, ya que afecta al host.
  hostWidth = input<'100%' | `${number}px` | 'auto'>('100%');
}
