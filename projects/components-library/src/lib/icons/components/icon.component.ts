import { Component, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconName, ICONS } from '../icon.constants';

@Component({
  selector: 'lib-icon',
  standalone: true,
  template: `
    <span [innerHTML]="sanitizedIcon" [style.width]="size() + 'px'"></span>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }
    span {
      display: inline-flex;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `],
  host: {
    'data-component': 'icon' // Agregamos este atributo host para prevenir la colisión de ID
  }
})
export class IconComponent {
  name = input<string>();
  size = input<number | string | undefined >(24);
  color = input<string>('currentColor');

  constructor(private sanitizer: DomSanitizer) {}

  get sanitizedIcon(): SafeHtml {
    const icon = ICONS[this.name() as IconName ] || '';
    
    // En lugar de forzar fill en el svg, aplicamos color solo a paths que no tengan fill="none"
    let colorizedIcon = icon;
    
    // Solo añadimos fill al svg si no hay paths con fill específico
    if (!icon.includes('fill=')) {
      colorizedIcon = icon.replace('svg', `svg fill="${this.color()}"`);
    } else {
      // Si hay fills específicos, respetamos el diseño original y solo aplicamos color via CSS
      colorizedIcon = icon.replace('<svg', `<svg style="color: ${this.color()}"`);
    }
    
    return this.sanitizer.bypassSecurityTrustHtml(colorizedIcon);
  }
}