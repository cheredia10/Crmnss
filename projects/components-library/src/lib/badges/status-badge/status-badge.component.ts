
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core"

@Component({
  selector: "lib-status-badge",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./status-badge.component.html",
  styleUrl: "./status-badge.component.scss",
})
export class StatusBadgeComponent {
  status = input.required<string>()
  // Nuevo input para opciones personalizadas de color
  options = input.required<Record<string, { label: string; backgroundColor: string; textColor: string }>>()

  // Signal computado para obtener los estilos dinámicos
  dynamicStyles = computed(() => {
    // Ya no necesitamos un valor por defecto porque 'options' siempre existirá.
    const statusKey = this.status().toLowerCase();
    const opts = this.options();

    const foundKey = Object.keys(opts).find(key => key.toLowerCase() === statusKey);

    if (foundKey && opts[foundKey]) {
      return {
        backgroundColor: opts[foundKey].backgroundColor,
        color: opts[foundKey].textColor,
      };
    }
    // Si aún así no lo encuentra (por un status que no está en las opciones),
    // devolvemos un estilo de "desconocido".
    return { backgroundColor: "#e9ecef", color: "#495057" };
  });

  // Signal para el label, por si las opciones lo definen
  label = computed(() => {
      const statusKey = this.status().toLowerCase();
      const opts = this.options();
      const foundKey = Object.keys(opts).find(key => key.toLowerCase() === statusKey);
      return (foundKey && opts[foundKey].label) ? opts[foundKey].label : this.status();
  });
}
