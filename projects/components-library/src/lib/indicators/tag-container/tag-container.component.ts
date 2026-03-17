import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Tag1Component, TagData } from '../tag-1/tag-1.component';

@Component({
  selector: 'lib-tag-container',
  imports: [CommonModule, Tag1Component],
  templateUrl: './tag-container.component.html',
  styleUrl: './tag-container.component.scss'
})
export class TagContainerComponent {
  // Inputs
  tags = input<TagData[]>([]);
  size = input<'small' | 'medium' | 'large'>('medium');
  variant = input<'filled' | 'outlined' | 'soft'>('filled');
  clickable = input<boolean>(false);
  removable = input<boolean>(false);
  direction = input<'horizontal' | 'vertical'>('horizontal');
  wrap = input<boolean>(true);
  gap = input<string>('8px');

  // Outputs
  tagClick = output<{ tag: TagData; index: number }>();
  tagRemove = output<{ tag: TagData; index: number }>();

  // Computed
  groupClass = input<string>('');

  // Métodos
  onTagClick(tag: TagData, index: number): void {
    this.tagClick.emit({ tag, index });
  }

  onTagRemove(tag: TagData, index: number): void {
    this.tagRemove.emit({ tag, index });
  }

  trackByFn(index: number, item: TagData): any {
    return item.id || index;
  }
}
