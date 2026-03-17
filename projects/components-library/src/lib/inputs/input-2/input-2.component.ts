import { Component, input, model, output } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';

import { FormsModule } from '@angular/forms';

export type SearchVariant = 'light' | 'dark';
export type SearchSize = 'full' | 'compact';

@Component({
  selector: 'lib-input-2',
  imports: [IconComponent, FormsModule],
  templateUrl: './input-2.component.html',
  styleUrl: './input-2.component.scss'
})
export class Input2Component {
  // Inputs usando la nueva sintaxis
  variant = input<SearchVariant>('light');
  size = input<SearchSize>('full');
  placeholder = input<string>('Search');
  disabled = input<boolean>(false);
  iconName = input<string>('search');

  // Model para two-way binding
  searchValue = model<string>('');

  // Outputs
  onFocus = output<void>();
  onBlur = output<void>();
  onButtonClick = output<void>();
  onSearch = output<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
    this.onSearch.emit(target.value);
  }
}
