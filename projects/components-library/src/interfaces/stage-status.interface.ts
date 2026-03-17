// Estados para tracker con anillos (tabla)
export type RingStageStatus = 'finalizado' | 'en-proceso' | 'iniciado' | 'observado' | 'no-conforme' | 'deshabilitado';

// Estados para indicador circular (modales/formularios) - Estados completos
export type CircleStageStatus = 'no-iniciada' | 'en-progreso' | 'bloqueada' | 'finalizada' | 'requiere-revision';

// Interfaz para tracker con anillos
export interface RingStage {
  name: string;
  status: RingStageStatus;
}

// Interfaz para indicador circular
export interface CircleStage {
  name: string;
  status: CircleStageStatus;
}

// Mantener compatibilidad con DevelopmentStage existente
export type DevelopmentStageStatus = RingStageStatus;
export interface DevelopmentStage extends RingStage {}