import { Component, input } from '@angular/core';

import { RouterModule } from "@angular/router"
import { IconComponent} from '../../icons/components/icon.component'
import { BreadcrumbItem } from '../../../interfaces/breadcrumb-item.interface';



@Component({
  selector: 'lib-breadcrumb-1',
  imports: [RouterModule, IconComponent],
  templateUrl: './breadcrumb-1.component.html',
  styleUrl: './breadcrumb-1.component.scss'
})
export class Breadcrumb1Component {
  items = input<BreadcrumbItem[]>([])
  variant = input<'default' | 'variant3' | 'variant4'>('default')

  // i18n: Texto configurable desde la app padre
  ariaLabel = input<string>('breadcrumb')
}
