export interface NavigationStep {
  id: string;           // 'descripcion', 'contencion', etc.
  label: string;        // 'Descripción', 'Contención', etc.
  number: number;       // 1, 2, 3, 4, 5
  status: 'completed' | 'active' | 'pending';
}

export type NavigationStepStatus = 'completed' | 'active' | 'pending';