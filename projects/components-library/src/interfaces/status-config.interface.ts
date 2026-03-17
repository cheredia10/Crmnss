/**
 * Configuración de un estado - Interfaz flexible para definir estados con colores
 */
export interface StatusConfig {
  key: string;                    // Identificador único del estado
  label: string;                  // Nombre mostrado al usuario
  color: string;                  // Color principal (hex)
  backgroundColor?: string;       // Color de fondo para badges/fondos
  borderColor?: string;          // Color de borde si es necesario
  textColor?: string;            // Color del texto si es diferente al principal
}

/**
 * Etapa con estado configurable - Para trackers y indicadores
 */
export interface ConfigurableStage {
  name: string;                  // Nombre de la etapa
  status: StatusConfig;          // Configuración del estado
}

/**
 * Colección de configuraciones de estado
 */
export type StatusConfigMap = Record<string, StatusConfig>;

/**
 * Tipos de visualización de estado
 */
export type StatusDisplayType = 'ring' | 'circle' | 'badge' | 'dot';