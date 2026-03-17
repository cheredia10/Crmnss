import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-form-header',
  imports: [],
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent {
  title = input.required<string>()
}
