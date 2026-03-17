
import {
  Component,
  type ElementRef,
  inject,
  input,
  type OnInit,
  output,
  ViewChild,
  type OnDestroy,
} from "@angular/core"
import { DropdownMenuItemComponent } from "../dropdown-menu-item/dropdown-menu-item.component"
import { IconComponent } from "../../icons/components/icon.component"
import { DropdownService } from "../../../services/dropdown.service"

export interface DropdownMenuItem {
  id: string
  label: string
  icon: string
  disabled?: boolean
  visible?: boolean
  action?: () => void
}

@Component({
  selector: "lib-dropdown-menu",
  standalone: true,
  imports: [DropdownMenuItemComponent, IconComponent],
  templateUrl: "./dropdown-menu.component.html",
  styleUrl: "./dropdown-menu.component.scss",
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
})
export class DropdownMenuComponent implements OnInit, OnDestroy {
  items = input<DropdownMenuItem[]>([])
  position = input<"left" | "right">("right")
  hasCustomTrigger = input<boolean>(false)

  itemClick = output<DropdownMenuItem>()
  readonly openStateChange = output<boolean>()

  @ViewChild("dropdownContainer") dropdownContainer!: ElementRef
  @ViewChild("triggerButton") triggerButton!: ElementRef

  private dropdownService = inject(DropdownService)
  private _isOpen = false
  private scrollListener?: () => void

  verticalPosition: "up" | "down" = "down"

  set isOpen(value: boolean) {
    if (this._isOpen !== value) {
      this._isOpen = value
      this.openStateChange.emit(value)

      if (value) {
        this.calculateVerticalPosition()
        this.addScrollListener()
      } else {
        this.removeScrollListener()
      }
    }
  }

  get isOpen(): boolean {
    return this._isOpen
  }

  ngOnInit(): void {
    this.dropdownService.dropdownOpened$.subscribe((openedDropdown) => {
      if (openedDropdown !== this) {
        this.isOpen = false
      }
    })
  }

  ngOnDestroy(): void {
    this.removeScrollListener()
  }

  private addScrollListener(): void {
    this.scrollListener = () => {
      // Cerrar el menú cuando hay scroll en cualquier parte de la página
      this.isOpen = false
    }

    // Escuchar scroll en window y en elementos con scroll
    window.addEventListener("scroll", this.scrollListener, true) // true para capturar en fase de captura
  }

  private removeScrollListener(): void {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true)
      this.scrollListener = undefined
    }
  }

  toggle(event: Event): void {
    event.stopPropagation()

    if (!this.isOpen) {
      this.dropdownService.notifyOpened(this)
    }

    this.isOpen = !this.isOpen
  }

  private calculateVerticalPosition(): void {
    if (!this.triggerButton?.nativeElement) return

    const triggerRect = this.triggerButton.nativeElement.getBoundingClientRect()
    const menuHeight = this.items().length * 40 + 16
    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top

    this.verticalPosition = spaceBelow < menuHeight && spaceAbove > spaceBelow ? "up" : "down"
  }

  getVisibleItems(): DropdownMenuItem[] {
    return this.items().filter((item) => item.visible !== false)
  }

  onItemClick(item: DropdownMenuItem): void {
    if (item.disabled) return

    this.itemClick.emit(item)
    if (item.action && typeof item.action === "function") {
      item.action()
    }
    this.isOpen = false
  }

  onDocumentClick(event: Event): void {
    if (this.isOpen && this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
      this.isOpen = false
    }
  }

  getMenuLeft(): number {
    if (!this.triggerButton?.nativeElement) return 0

    const triggerRect = this.triggerButton.nativeElement.getBoundingClientRect()
    const menuWidth = 180

    if (this.position() === "right") {
      return triggerRect.right - menuWidth
    } else {
      return triggerRect.left
    }
  }

  getMenuTop(): number {
    if (!this.triggerButton?.nativeElement) return 0

    const triggerRect = this.triggerButton.nativeElement.getBoundingClientRect()

    if (this.verticalPosition === "up") {
      const menuHeight = this.items().length * 40 + 16
      return triggerRect.top - menuHeight - 8
    } else {
      return triggerRect.bottom + 8
    }
  }
}
