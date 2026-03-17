import { Component, effect, input, output, signal } from '@angular/core';

import { Tab } from '../../../interfaces/tab.interface';

@Component({
  selector: 'lib-tab-1',
  imports: [],
  templateUrl: './tab-1.component.html',
  styleUrl: './tab-1.component.scss'
})
export class Tab1Component {
  title = input<string>('');
  // Input como signal requerido
  readonly tabsInput = input.required<ReadonlyArray<Tab>>();

  // Output como signal (EventEmitter por debajo)
  readonly tabChange = output<string>();

  // Estado interno con signals
  tabs = signal<Tab[]>([]);
  activeTabId = signal<string>("");

  constructor() {
    // Reacciona al cambio del input
    effect(() => {
      const value = this.tabsInput();

      this.tabs.set([...value]);

      // Set first tab as active if none is active
      if (!value.some((tab) => tab.active)) {
        this.selectTab(value[0]?.id);
      } else {
        const activeTab = value.find((tab) => tab.active);
        if (activeTab) {
          this.activeTabId.set(activeTab.id);
        }
      }
    });
  }

  selectTab(tabId: string): void {
    this.activeTabId.set(tabId);
    this.tabChange.emit(tabId);
  }


}
