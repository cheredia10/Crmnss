export interface MenuItem {
    label: string;
    icon?: string;         // Para IconComponent (SVGs custom)
    matIcon?: string;      // Para MaterialIconComponent (Google Fonts)
    route?: string;        // Opcional
    badge?: number;        // Opcional
    children?: MenuItem[]; // Opcional y recursivo
}