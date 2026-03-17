import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-form-button',
  imports: [],
  templateUrl: './form-button.component.html',
  styleUrl: './form-button.component.scss'
})
export class FormButtonComponent {
  label = input.required<string>()
  type = input<"button" | "submit" | "reset">("button")
  variant = input<"primary" | "secondary" | "outline">("primary")
  disabled = input<boolean>(false)
  onClick = output<void>()

  getButtonClasses(): string {
    return `btn btn-${this.variant()}`
  }
}
