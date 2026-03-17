import { CommonModule } from '@angular/common';
import { Component, computed, input, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-icon-button',
  standalone: true,
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  imports: [CommonModule],
})
export class IconButtonComponent {
  private sanitizer = inject(DomSanitizer);

  height = input<number | string>(44);
  width = input<number | string>(200);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  icon = input<string>('');

  // Computed para el ícono sanitizado
  sanitizedIcon = computed(() => {
    const iconString = this.icon();
    return iconString ? this.sanitizer.bypassSecurityTrustHtml(iconString) : null;
  });

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
