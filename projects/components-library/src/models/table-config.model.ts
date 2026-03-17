export interface TableColumn {
  key: string
  header: string
  sortable?: boolean
  width?: string
  minWidth?: string
  maxWidth?: string
  allowWrap?: boolean
  cellTemplate?: string
  position?: number
  sticky?: 'left' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  cellAlign?: 'left' | 'center' | 'right'
  headerPaddingLeft?: string
  headerPaddingRight?: string
  headerPaddingTop?: string
  headerPaddingBottom?: string
}

export interface TableConfig {
  showCheckboxColumn?: boolean
  checkboxPosition?: "left" | "right"
  showStatusColumn?: boolean
  statusPosition?: number
  statusHeaderLabel?: string
  statusIsEditable?: boolean
  statusIsSortable?: boolean
  /**
   * Propiedad del objeto de datos que contiene el valor del estado.
   * Por defecto es 'status'. Útil cuando el modelo de datos usa una propiedad diferente
   * como 'estado', 'state', etc.
   * @default 'status'
   * @example
   * // Si tu modelo usa 'estado' en lugar de 'status':
   * { statusKey: 'estado', showStatusColumn: true }
   */
  statusKey?: string
  /**
   * Ancho de la columna de status
   * @example '120px', '10%', 'auto'
   */
  statusWidth?: string
  /**
   * Ancho mínimo de la columna de status
   * @example '100px'
   */
  statusMinWidth?: string
  /**
   * Ancho máximo de la columna de status
   * @example '200px'
   */
  statusMaxWidth?: string
  /**
   * Alineación del header de la columna de status
   * @example 'center', 'left', 'right'
   */
  statusHeaderAlign?: 'left' | 'center' | 'right'
  /**
   * Alineación del contenido de las celdas de status
   * @example 'center', 'left', 'right'
   */
  statusCellAlign?: 'left' | 'center' | 'right'
  showActionsColumn?: boolean
  actionsPosition?: "left" | "right"
  // --- NUEVA PROPIEDAD ---
  /**
   * Determina si las columnas de acciones y checkbox deben ser fijas (sticky) al hacer scroll horizontal.
   * @default true
   */
  stickyColumns?: boolean;
  /**
   * Ancho de la columna de detalles (expandable table)
   * @default '106px'
   * @example '120px', '10%', 'auto'
   */
  detailsColumnWidth?: string;
  /**
   * Ancho mínimo de la columna de detalles (expandable table)
   * @example '100px'
   */
  detailsColumnMinWidth?: string;
  /**
   * Ancho máximo de la columna de detalles (expandable table)
   * @example '200px'
   */
  detailsColumnMaxWidth?: string;
  /**
   * Texto del header de la columna de detalles (expandable table)
   * @default 'Detalles'
   */
  detailsHeaderLabel?: string;
  columns: TableColumn[]
  sortable?: boolean
  selectable?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  showTableTitle?: boolean
}

export type StatusType = "active" | "closed" | "pending" | "na"

export interface StatusOption {
  value: string
  label: string
  color: string
}

export interface ActionItem {
  label: string
  icon?: string
  action: (item: any) => void
  visible?: (item: any) => boolean
  disabled?: (item: any) => boolean
}

export interface TableData {
  id: string | number
  [key: string]: any
}
