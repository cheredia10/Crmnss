import { Pipe, PipeTransform, inject, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'customDate',
    standalone: true,
    pure: false // Hacer el pipe impuro para que reaccione a cambios
})
export class CustomDatePipe implements PipeTransform {
    private readonly translateService = inject(TranslateService);

    transform(value: string | Date | null | undefined): string {
        if (!value) return '';
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value.toString();

            // Obtener el locale actual del TranslateService
            const currentLang = this.translateService.currentLang || 'es';
            const locale = currentLang === 'en' ? 'en-US' : 'es-ES';

            // Formato "D Mes AAAA" usando el locale activo
            const formatted = new Intl.DateTimeFormat(locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(date);

            // Elimina el punto que `Intl` añade a las abreviaturas de meses en español
            return formatted.replace('.', '');
        } catch (error) {
            return value.toString();
        }
    }
}