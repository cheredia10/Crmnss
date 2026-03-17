import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-tab-content',
  imports: [CommonModule],
  templateUrl: './tab-content.component.html',
  styleUrl: './tab-content.component.scss'
})
export class TabContentComponent {
  tabId = input<string>('');
  active = input<boolean>(false);
  height = input<string>('calc(100vh - 230px)'); // valor por defecto
}
