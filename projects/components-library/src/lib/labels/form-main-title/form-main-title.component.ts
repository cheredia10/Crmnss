import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'lib-form-main-title',
  standalone: true,
  imports: [],
  templateUrl: './form-main-title.component.html',
  styleUrl: './form-main-title.component.scss'
})
export class FormMainTitleComponent {
  text = input.required<string>();
}
