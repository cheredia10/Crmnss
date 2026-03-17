import { Component, signal, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICONS } from '../icons/icon.constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  private sanitizer = inject(DomSanitizer);
  isOpen = signal(false);

  upIcon: SafeHtml;
  downIcon: SafeHtml;
  title = input<string>('Desplegable');

  constructor() {
    this.upIcon = this.sanitizer.bypassSecurityTrustHtml(ICONS['dropdown-up']);
    this.downIcon = this.sanitizer.bypassSecurityTrustHtml(ICONS['dropdown-down']);
  }

  toggle() {
    this.isOpen.update((v) => !v);
  }
}
