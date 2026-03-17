export interface RadioOption {
    value: string | number | boolean;
    label: string;
    disabled?: boolean;
    // Propiedades para ícono de información
    showInfoIcon?: boolean;           // Mostrar ícono de info
    infoTooltip?: string;            // Tooltip al hacer hover
    infoData?: any;                  // Datos adicionales para el evento
}