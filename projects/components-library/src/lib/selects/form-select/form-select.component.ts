import { Component, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '../../../interfaces/select-option.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-form-select',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss'
})
export class FormSelectComponent {
  placeholder = input<string>("Seleccione una opción")
  control = input.required<AbstractControl>()
  id = input.required<string>()
  options = input.required<SelectOption[]>()
  inputWidth = input<string>('100%');

}
