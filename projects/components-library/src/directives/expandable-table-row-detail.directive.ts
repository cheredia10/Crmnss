import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[expandableTableRowDetail]',
  standalone: true,
})
export class ExpandableTableRowDetailDirective {
constructor(public templateRef: TemplateRef<any>) {}
}
