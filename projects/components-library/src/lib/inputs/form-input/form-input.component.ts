import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-form-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent {
  placeholder = input<string>("")
  type = input<string>("text")
  control = input.required<AbstractControl>()
  id = input.required<string>()
  inputWidth = input<string>('100%')     // Ej: '150px', '30%', 'calc(100% - 150px)', 'flex-1'
  inputHeight = input<string>('44px')    // Altura total del input incluyendo bordes
  suffix = input<string>("")  // Opcional: símbolo o texto a mostrar al final del input (ej: '%', '$', 'kg')
  disabled = input<boolean>(false)  // Para deshabilitar el input independientemente del FormControl

  // i18n: Mensajes de error configurables desde la app padre
  requiredErrorMessage = input<string>('Este campo es requerido')
  emailErrorMessage = input<string>('Ingrese un email válido')
  invalidFieldMessage = input<string>('Campo inválido')


  getErrorMessage(): string {
    const control = this.control()
    if (control.hasError("required")) {
      return this.requiredErrorMessage()
    }
    if (control.hasError("email")) {
      return this.emailErrorMessage()
    }
    return this.invalidFieldMessage()
  }
}
