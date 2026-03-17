import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-file-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-chip.component.html',
  styleUrl: './file-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileChipComponent {
  fileName = input.required<string>();
  fileSize = input.required<number>();
  remove = output<void>();

  // i18n support: Configurable texts from parent component
  removeTooltip = input<string>(''); // Tooltip for remove button
  removeAriaLabel = input<string>(''); // Aria-label for accessibility

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}