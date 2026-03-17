import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[libTableSort]',
  standalone: true
})
export class TableSortDirective {
  @Input("libTableSort") sortKey!: string
  @Input() sortDirection: "asc" | "desc" = "asc"
  @Input() sorted = false

  @Output() sort = new EventEmitter<{ key: string; direction: "asc" | "desc" }>()

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) { }

  @HostListener("click")
  onClick() {
    if (this.sorted) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    } else {
      this.sorted = true
      this.sortDirection = "asc"
    }

    this.sort.emit({ key: this.sortKey, direction: this.sortDirection })
  }

  ngOnChanges() {
    if (this.sorted) {
      this.renderer.addClass(this.el.nativeElement, "sorted")
      this.renderer.setAttribute(this.el.nativeElement, "data-sort-direction", this.sortDirection)
    } else {
      this.renderer.removeClass(this.el.nativeElement, "sorted")
      this.renderer.removeAttribute(this.el.nativeElement, "data-sort-direction")
    }
  }

}
