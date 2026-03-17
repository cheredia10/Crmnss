import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../icons/components/icon.component';

export interface RadialMenuOption {
  icon: string
  route?: string
  action?: () => void
  label?: string
}

@Component({
  selector: 'lib-radial-menu',
  imports: [CommonModule, IconComponent],
  templateUrl: './radial-menu.component.html',
  styleUrl: './radial-menu.component.scss'
})
export class RadialMenuComponent {
  @Input() centerIcon = ""
  @Input() options: RadialMenuOption[] = []
  @Input() label = "Modulo"
  @Input() size = 75
  @Input() isDisabled = false
  @Output() optionClick = new EventEmitter<RadialMenuOption>()

  isActive = false

  constructor(private router: Router) { }

  onCenterHover(isHovered: boolean) {
    this.isActive = isHovered
  }

  onOptionClick(option: RadialMenuOption, event: Event) {
    event.stopPropagation()

    if (option.route) {
      this.router.navigate([option.route])
    }

    if (option.action) {
      option.action()
    }

    this.optionClick.emit(option)
  }

  getOptionPosition(index: number): { x: number; y: number } {
    // Parámetros con ajuste fino
    const radius = 92 // Radio ligeramente reducido
    const fixedAngleStep = 38 // Ángulo ligeramente reducido
    const startAngle = -85 // Mantener ángulo de inicio

    // Calcular ángulo con incremento fijo desde posición inicial
    const angleInDegrees = startAngle + (index * fixedAngleStep)
    const angle = (angleInDegrees * Math.PI) / 180 // Convertir a radianes

    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return { x, y }
  }

  // Listener de documento removido para simplificar
}
