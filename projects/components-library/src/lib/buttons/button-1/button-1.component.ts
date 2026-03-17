import { CommonModule } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';

@Component({
  selector: 'lib-button',
  standalone: true,
  templateUrl: './button-1.component.html',
  styleUrls: ['./button-1.component.scss'],
  imports: [CommonModule],
})
export class Button1Component {
  variant = input<'primary' | 'secondary' | 'tertiary' | 'danger'>('primary');
  disabled = input<boolean>(false);
  size = input<'large' | 'medium' | 'small'>('medium');
  height = input<number | string | null>(null);
  width = input<number | string | null>(null);
  type = input<'button' | 'submit' | 'reset'>('button');

  // Computed signal para los estilos dinámicos
  buttonStyles = computed(() => {
    const styles: { [key: string]: string } = {};

    const w = this.width();
    if (w !== null) {
      styles['width'] = typeof w === 'number' ? `${w}px` : w;
    }

    const h = this.height();
    if (h !== null) {
      styles['height'] = typeof h === 'number' ? `${h}px` : h;
    }

    return styles;
  });
}
