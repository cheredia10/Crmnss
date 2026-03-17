import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DropdownMenuComponent } from '../lib/tables/dropdown-menu/dropdown-menu.component';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  private openDropdown = new Subject<DropdownMenuComponent>()

  dropdownOpened$ = this.openDropdown.asObservable()

  notifyOpened(component: DropdownMenuComponent) {
    this.openDropdown.next(component)
  }

}
