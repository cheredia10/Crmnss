import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[libTableColumn]',
  standalone: true
})
export class TableColumnDirective {
  @Input("libTableColumn") columnName!: string

  constructor(public templateRef: TemplateRef<any>) {}

}
