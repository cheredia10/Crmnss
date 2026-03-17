
import { Component, input, output } from '@angular/core';
import { IconComponent } from '../../icons/components/icon.component';

@Component({
  selector: 'lib-upload-progress',
  imports: [IconComponent],
  templateUrl: './upload-progress.component.html',
  styleUrl: './upload-progress.component.scss'
})
export class UploadProgressComponent {
  // Inputs
  progress = input<number>(0);
  text = input<string>('Subiendo...');
  details = input<string>('');

  // Outputs
  pause = output<void>();
  cancel = output<void>();

  // Methods
  onPause(): void {
    this.pause.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
