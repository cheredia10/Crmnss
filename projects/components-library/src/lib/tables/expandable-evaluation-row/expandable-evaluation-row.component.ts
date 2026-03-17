import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export interface EvaluationData {
  date: string
  name: string
  status: string // Changed to string to support i18n
  details: {
    entregas_puntuales: number
    calidad_servicio: string // Changed to string to support i18n
    incidentes_reportados: number
    observaciones: string
  }
}

export interface EvaluationLabels {
  onTimeDeliveries?: string;
  serviceQuality?: string;
  reportedIncidents?: string;
  observations?: string;
}

@Component({
  selector: 'lib-expandable-evaluation-row',
  imports: [CommonModule],
  templateUrl: './expandable-evaluation-row.component.html',
  styleUrl: './expandable-evaluation-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableEvaluationRowComponent {
  data = input.required<EvaluationData>()
  labels = input<EvaluationLabels>({
    onTimeDeliveries: 'Entregas puntuales:',
    serviceQuality: 'Calidad del servicio:',
    reportedIncidents: 'Incidentes reportados:',
    observations: 'Observaciones:'
  })

  private _isExpanded = signal(false)

  isExpanded = computed(() => this._isExpanded())

  statusClass = computed(() => {
    return this.data().status.toLowerCase().replace(/\s+/g, "-")
  })

  toggleExpanded(): void {
    this._isExpanded.update((current) => !current)
  }
}
