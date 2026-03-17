import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SubModule {
  id: string;
  title: string;
  icon: string;
  route?: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  isActive?: boolean;
  isClickable?: boolean;
  subModules?: SubModule[];
}

@Component({
  selector: 'lib-module-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-card.component.html',
  styleUrl: './module-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleCardComponent {
  module = input.required<ModuleItem>();

  // Outputs
  moduleClick = output<ModuleItem>();
  subModuleClick = output<SubModule>();

  onModuleClick(): void {
    if (this.module().isClickable !== false) {
      this.moduleClick.emit(this.module());
    }
  }

  onSubModuleClick(subModule: SubModule): void {
    this.subModuleClick.emit(subModule);
  }
}