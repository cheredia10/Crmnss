import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[scrollClose]',
  standalone: true
})
export class ScrollCloseDirective implements OnDestroy {
  @Output() scrollClose = new EventEmitter<void>();

  private scrollableAncestors: HTMLElement[] = [];

  constructor(private elementRef: ElementRef) {
    this.findScrollableAncestors();
    this.addScrollListeners();
  }

  ngOnDestroy(): void {
    this.removeScrollListeners();
  }

  /**
   * Finds all scrollable ancestor elements
   */
  private findScrollableAncestors(): void {
    let element = this.elementRef.nativeElement.parentElement;

    while (element && element !== document.body) {
      const computedStyle = window.getComputedStyle(element);
      const hasScrollX = computedStyle.overflowX === 'auto' || computedStyle.overflowX === 'scroll';
      const hasScrollY = computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll';

      // Also check for specific classes that indicate scrollable containers
      const isScrollableContainer =
        element.classList.contains('dialog-content') ||
        element.classList.contains('custom-scrollbar') ||
        element.classList.contains('table-scroll-wrapper') ||
        element.classList.contains('mat-mdc-dialog-content');

      if (hasScrollX || hasScrollY || isScrollableContainer) {
        this.scrollableAncestors.push(element);
      }

      element = element.parentElement;
    }

    // Always add document and window as fallback
    this.scrollableAncestors.push(document.documentElement);
  }

  /**
   * Add scroll event listeners to all scrollable ancestors
   */
  private addScrollListeners(): void {
    this.scrollableAncestors.forEach(element => {
      element.addEventListener('scroll', this.handleScroll, { passive: true });
    });

    // Also listen to window scroll
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  /**
   * Remove all scroll event listeners
   */
  private removeScrollListeners(): void {
    this.scrollableAncestors.forEach(element => {
      element.removeEventListener('scroll', this.handleScroll);
    });

    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   * Handle scroll events
   */
  private handleScroll = (): void => {
    this.scrollClose.emit();
  }
}