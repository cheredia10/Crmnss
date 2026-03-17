// src/app/tooltip.directive.ts
import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

/**
 * Directiva de Angular para crear tooltips personalizados con temas y posiciones.
 *
 * @example
 * <button appTooltip="Este es mi tooltip" tooltipPosition="bottom" tooltipTheme="dark">
 * Hover sobre mí
 * </button>
 */
@Directive({
  selector: '[libTooltip]', // Selector para usar la directiva: <div appTooltip="...">
  standalone: true // Marcado como standalone para Angular 19+
})
export class TooltipDirective implements OnDestroy {
  /**
   * El texto que se mostrará dentro del tooltip.
   * Se asigna directamente al selector de la directiva: libTooltip="Texto del tooltip".
   */
  @Input('libTooltip') tooltipText: string = '';

  /**
   * El tema visual del tooltip. Puede ser 'normal' (claro) o 'dark' (oscuro).
   * Por defecto es 'normal'.
   */
  @Input() tooltipTheme: 'normal' | 'dark' = 'normal';

  /**
   * La posición del tooltip respecto al elemento anfitrión.
   * Puede ser 'top', 'bottom', 'left' o 'right'.
   * Por defecto es 'top'.
   */
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltipElement: HTMLElement | null = null; // Referencia al elemento HTML del tooltip
  private arrowElement: HTMLElement | null = null;   // Referencia al elemento HTML del triángulo (flecha)
  private scrollListener: ((event: Event) => void) | null = null; // Listener para eventos de scroll
  private clickListener: ((event: MouseEvent) => void) | null = null;   // Listener para eventos de click

  /**
   * Constructor de la directiva.
   * @param el ElementRef para acceder al elemento DOM anfitrión.
   * @param renderer Renderer2 para manipular el DOM de forma segura y compatible con SSR.
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Escucha el evento 'mouseenter' en el elemento anfitrión para mostrar el tooltip.
   */
  @HostListener('mouseenter') onMouseEnter(): void {
    this.showTooltip();
  }

  /**
   * Escucha el evento 'mouseleave' en el elemento anfitrión para ocultar el tooltip.
   */
  @HostListener('mouseleave') onMouseLeave(): void {
    this.hideTooltip();
  }

  /**
   * Escucha el evento 'click' en el elemento anfitrión para ocultar el tooltip.
   * Usamos un pequeño delay para permitir que otros eventos de click se procesen primero.
   */
  @HostListener('click') onClick(): void {
    // Pequeño delay para que el evento click del botón se procese primero
    setTimeout(() => {
      this.hideTooltip();
    }, 0);
  }

  /**
   * Muestra el tooltip.
   * Crea el elemento del tooltip y la flecha si no existen, los adjunta al DOM
   * y calcula su posición.
   */
  private showTooltip(): void {
    // No mostrar el tooltip si no hay texto definido
    if (!this.tooltipText) {
      return;
    }

    // Si el tooltip no ha sido creado, lo creamos
    if (!this.tooltipElement) {
      // Crear el contenedor principal del tooltip
      this.tooltipElement = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltipElement, 'app-tooltip');
      // Añadir la clase del tema (normal o dark)
      this.renderer.addClass(this.tooltipElement, `app-tooltip-${this.tooltipTheme}`);

      // Crear el elemento para la flecha (triángulo)
      this.arrowElement = this.renderer.createElement('div');
      this.renderer.addClass(this.arrowElement, 'app-tooltip-arrow');
      // Añadir la clase de posición para la flecha
      this.renderer.addClass(this.arrowElement, `app-tooltip-arrow-${this.tooltipPosition}`);

      // Añadir el texto al tooltip
      this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipText));
      // Añadir la flecha al tooltip
      this.renderer.appendChild(this.tooltipElement, this.arrowElement);
      // Adjuntar el tooltip al body del documento para que esté fuera del flujo de diseño normal
      this.renderer.appendChild(document.body, this.tooltipElement);
    }

    // Asegurar que el tooltip esté visible y posicionado correctamente
    this.positionTooltip();
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    this.renderer.setStyle(this.tooltipElement, 'visibility', 'visible');

    // Agregar listeners para scroll y click global para ocultar el tooltip
    this.addEventListeners();
  }

  /**
   * Oculta el tooltip.
   * Simplemente cambia la opacidad y visibilidad para una transición suave.
   */
  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      this.renderer.setStyle(this.tooltipElement, 'visibility', 'hidden');
      
      // Remover listeners cuando se oculta el tooltip
      this.removeEventListeners();
    }
  }

  /**
   * Calcula y establece la posición del tooltip y su flecha.
   * Se basa en la posición del elemento anfitrión y la posición deseada del tooltip.
   */
  private positionTooltip(): void {
    if (!this.tooltipElement || !this.arrowElement) {
      return;
    }

    // Obtener las dimensiones y posición del elemento anfitrión
    const hostRect = this.el.nativeElement.getBoundingClientRect();
    // Obtener las dimensiones del tooltip (necesario para el cálculo)
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let offset = 10; // Distancia en píxeles entre el elemento anfitrión y el tooltip

    // Asegurarse de que la clase de posición de la flecha esté actualizada
    // Primero, remover todas las clases de posición de flecha existentes
    this.renderer.removeClass(this.arrowElement, 'app-tooltip-arrow-top');
    this.renderer.removeClass(this.arrowElement, 'app-tooltip-arrow-bottom');
    this.renderer.removeClass(this.arrowElement, 'app-tooltip-arrow-left');
    this.renderer.removeClass(this.arrowElement, 'app-tooltip-arrow-right');
    // Luego, añadir la clase de posición actual
    this.renderer.addClass(this.arrowElement, `app-tooltip-arrow-${this.tooltipPosition}`);

    // Calcular la posición del tooltip según la `tooltipPosition`
    switch (this.tooltipPosition) {
      case 'top':
        offset+=20;
        // El tooltip se coloca encima del elemento
        top = hostRect.top - tooltipRect.height - offset;
        left = hostRect.left + (hostRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        offset+=20;
        // El tooltip se coloca debajo del elemento
        top = hostRect.bottom + offset;
        left = hostRect.left + (hostRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        // El tooltip se coloca a la izquierda del elemento
        top = hostRect.top + (hostRect.height / 2) - (tooltipRect.height / 2);
        left = hostRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        // El tooltip se coloca a la derecha del elemento
        top = hostRect.top + (hostRect.height / 2) - (tooltipRect.height / 2);
        left = hostRect.right + offset;
        break;
    }

    // Ajustar la posición para tener en cuenta el desplazamiento de la ventana (scroll)
    // Esto es crucial porque el tooltip se adjunta al `document.body`
    top += window.scrollY;
    left += window.scrollX;

    // Establecer las propiedades de estilo 'top' y 'left' del tooltip
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  /**
   * Agrega event listeners para scroll y click global.
   */
  private addEventListeners(): void {
    // Solo agregar listeners si no existen ya
    if (!this.scrollListener) {
      this.scrollListener = (event: Event) => {
        this.hideTooltip();
      };
      window.addEventListener('scroll', this.scrollListener, true); // true para capturar scroll en cualquier elemento
    }

    if (!this.clickListener) {
      this.clickListener = (event: MouseEvent) => {
        // Verificar si el click fue fuera del elemento anfitrión
        if (!this.el.nativeElement.contains(event.target as Node)) {
          this.hideTooltip();
        }
      };
      document.addEventListener('click', this.clickListener);
    }
  }

  /**
   * Remueve los event listeners.
   */
  private removeEventListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
      this.scrollListener = null;
    }

    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Es crucial para limpiar el elemento del tooltip del DOM y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    // Remover listeners primero
    this.removeEventListeners();
    
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
      this.arrowElement = null;
    }
  }
}