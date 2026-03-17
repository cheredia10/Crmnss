
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  model,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
  inject,
  LOCALE_ID,
} from "@angular/core"

type ViewMode = "day" | "month" | "year"
type SelectionMode = "single" | "range" | "multiple"

@Component({
  selector: "lib-date-picker-2",
  imports: [],
  templateUrl: "./date-picker-2.component.html",
  styleUrl: "./date-picker-2.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePicker2Component {
  private elementRef = inject(ElementRef)
  private locale = inject(LOCALE_ID)

  @ViewChild("calendarContainer", { static: false }) calendarContainer!: ElementRef

  // Inputs
  theme = input<"light" | "dark">("light")
  selectionMode = input<SelectionMode>("single")
  minDate = input<Date | null>(null)
  maxDate = input<Date | null>(null)
  triggerElement = input<HTMLElement | null>(null)

  // i18n: Textos configurables desde la app padre
  datePickerAriaLabel = input<string>('Selector de fecha')
  previousMonthAriaLabel = input<string>('Mes anterior')
  nextMonthAriaLabel = input<string>('Mes siguiente')
  previousYearAriaLabel = input<string>('Año anterior')
  nextYearAriaLabel = input<string>('Año siguiente')
  switchToMonthViewAriaLabel = input<string>('Cambiar a vista de meses')
  switchToYearViewAriaLabel = input<string>('Cambiar a vista de años')
  calendarAriaLabel = input<string>('Calendario')
  selectMonthAriaLabel = input<string>('Seleccionar mes')
  selectYearAriaLabel = input<string>('Seleccionar año')
  yearPrefix = input<string>('Año')

  // Model values
  isOpen = model(false)
  selectedDate = model<Date | null>(null)
  selectedDateRange = model<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  selectedDates = model<Date[]>([])

  // Outputs
  //dateChange = output<Date | null>()
  //dateRangeChange = output<{ start: Date | null; end: Date | null }>()
  //datesChange = output<Date[]>()

  // Internal state
  currentDate = signal(new Date())
  viewMode = signal<ViewMode>("day")
  viewDate = signal(this.selectedDate() ?? new Date())
  positionClass = signal<"top" | "bottom">("bottom")
  isInDialog = signal<boolean>(false)

  constructor() {
    // Effect para emitir cambios basados en el modo de selección
    // effect(() => {
    //   if (this.selectionMode() === "single" && this.selectedDate()) {
    //     this.dateChange.emit(this.selectedDate())
    //   } else if (this.selectionMode() === "range" && (this.selectedDateRange().start || this.selectedDateRange().end)) {
    //     this.dateRangeChange.emit(this.selectedDateRange())
    //   } else if (this.selectionMode() === "multiple" && this.selectedDates().length) {
    //     this.datesChange.emit(this.selectedDates())
    //   }
    // })

    // Effect para calcular posición cuando se abre
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.calculatePosition(), 0)
      }
    })
  }

  // Computed values - Usa LOCALE_ID inyectado para internacionalización
  monthName = computed(() => new Intl.DateTimeFormat(this.locale, { month: "long" }).format(this.viewDate()))
  year = computed(() => this.viewDate().getFullYear())
  calendarDays = computed(() => this.generateCalendarDays())

  monthsOfYear = computed(() => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(this.viewDate().getFullYear(), i, 1)
      months.push({
        name: new Intl.DateTimeFormat(this.locale, { month: "short" }).format(date),
        value: i,
        date,
      })
    }
    return months
  })

  yearsRange = computed(() => {
    const currentYear = this.viewDate().getFullYear()
    const startYear = currentYear - 6
    const years = []
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i)
    }
    return years
  })

  weekDays = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale, { weekday: "short" })
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2023, 0, 2 + i)
      const day = formatter.format(date)
      return day.charAt(0).toUpperCase() + day.slice(1, 3)
    })
  })

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) return

    const target = event.target as HTMLElement
    const triggerEl = this.triggerElement()

    // No cerrar si el clic es dentro del calendario o en el trigger
    if (this.elementRef.nativeElement.contains(target) || (triggerEl && triggerEl.contains(target))) {
      return
    }

    this.isOpen.set(false)
  }

  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.isOpen.set(false)
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen()) return

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        this.navigateDate(-1)
        break
      case "ArrowRight":
        event.preventDefault()
        this.navigateDate(1)
        break
      case "ArrowUp":
        event.preventDefault()
        this.navigateDate(-7)
        break
      case "ArrowDown":
        event.preventDefault()
        this.navigateDate(7)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        // Implementar selección de fecha actual
        break
    }
  }

  private calculatePosition(): void {
    if (!this.calendarContainer || !this.triggerElement()) return

    // Detectar si estamos dentro de un diálogo
    this.detectDialogContext()

    const triggerRect = this.triggerElement()!.getBoundingClientRect()
    const calendarHeight = 320 // Altura aproximada del calendario
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top

    // Si estamos en un diálogo, usar posicionamiento fixed
    if (this.isInDialog()) {
      this.positionCalendarInDialog(triggerRect, calendarHeight, viewportHeight)
    } else {
      // Comportamiento normal
      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        this.positionClass.set("top")
      } else {
        this.positionClass.set("bottom")
      }
    }
  }

  private detectDialogContext(): void {
    // Buscar si hay un elemento con clases de diálogo Material o modal en los ancestros
    let element = this.elementRef.nativeElement as HTMLElement
    while (element && element !== document.body) {
      const classList = element.classList
      if (
        classList.contains('mat-mdc-dialog-container') ||
        classList.contains('cdk-dialog-container') ||
        classList.contains('modal') ||
        classList.contains('dialog-content')
      ) {
        this.isInDialog.set(true)
        return
      }
      element = element.parentElement!
    }
    this.isInDialog.set(false)
  }

  private positionCalendarInDialog(triggerRect: DOMRect, calendarHeight: number, viewportHeight: number): void {
    const calendar = this.calendarContainer.nativeElement as HTMLElement
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top

    // Posicionar usando coordenadas fijas del viewport
    if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
      // Mostrar arriba
      this.positionClass.set("top")
      calendar.style.position = 'fixed'
      calendar.style.top = `${triggerRect.top - calendarHeight - 4}px`
      calendar.style.left = `${triggerRect.left}px`
      calendar.style.zIndex = '10000'
    } else {
      // Mostrar abajo
      this.positionClass.set("bottom")
      calendar.style.position = 'fixed'
      calendar.style.top = `${triggerRect.bottom + 4}px`
      calendar.style.left = `${triggerRect.left}px`
      calendar.style.zIndex = '10000'
    }
  }

  private navigateDate(days: number): void {
    if (this.viewMode() !== "day") return

    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setDate(date.getDate() + days)
      return newDate
    })
  }

  prevMonth(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setMonth(date.getMonth() - 1)
      return newDate
    })
  }

  nextMonth(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setMonth(date.getMonth() + 1)
      return newDate
    })
  }

  prevYear(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setFullYear(date.getFullYear() - 1)
      return newDate
    })
  }

  nextYear(): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setFullYear(date.getFullYear() + 1)
      return newDate
    })
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode)
  }

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) {
      return
    }

    if (this.selectionMode() === "single") {
      this.selectedDate.set(date)
      this.isOpen.set(false)
    } else if (this.selectionMode() === "range") {
      const currentRange = this.selectedDateRange()
      if (!currentRange.start || (currentRange.start && currentRange.end)) {
        this.selectedDateRange.set({ start: date, end: null })
      } else {
        if (date < currentRange.start) {
          this.selectedDateRange.set({ start: date, end: currentRange.start })
        } else {
          this.selectedDateRange.set({ start: currentRange.start, end: date })
        }
        this.isOpen.set(false)
      }
    } else if (this.selectionMode() === "multiple") {
      const currentDates = [...this.selectedDates()]
      const existingIndex = currentDates.findIndex(
        (d) =>
          d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
      )

      if (existingIndex >= 0) {
        currentDates.splice(existingIndex, 1)
      } else {
        currentDates.push(date)
      }
      this.selectedDates.set(currentDates)
    }
  }

  selectMonth(month: number): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setMonth(month)
      return newDate
    })
    this.viewMode.set("day")
  }

  selectYear(year: number): void {
    this.viewDate.update((date) => {
      const newDate = new Date(date)
      newDate.setFullYear(year)
      return newDate
    })
    this.viewMode.set("month")
  }

  isToday(date: Date): boolean {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  isSelected(date: Date): boolean {
    if (this.selectionMode() === "single" && this.selectedDate()) {
      return (
        date.getDate() === this.selectedDate()!.getDate() &&
        date.getMonth() === this.selectedDate()!.getMonth() &&
        date.getFullYear() === this.selectedDate()!.getFullYear()
      )
    } else if (this.selectionMode() === "multiple") {
      return this.selectedDates().some(
        (d) =>
          d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
      )
    }
    return false
  }

  isInRange(date: Date): boolean {
    if (this.selectionMode() !== "range" || !this.selectedDateRange().start || !this.selectedDateRange().end) {
      return false
    }
    return date > this.selectedDateRange().start! && date < this.selectedDateRange().end!
  }

  isRangeStart(date: Date): boolean {
    if (this.selectionMode() !== "range" || !this.selectedDateRange().start) {
      return false
    }
    return (
      date.getDate() === this.selectedDateRange().start!.getDate() &&
      date.getMonth() === this.selectedDateRange().start!.getMonth() &&
      date.getFullYear() === this.selectedDateRange().start!.getFullYear()
    )
  }

  isRangeEnd(date: Date): boolean {
    if (this.selectionMode() !== "range" || !this.selectedDateRange().end) {
      return false
    }
    return (
      date.getDate() === this.selectedDateRange().end!.getDate() &&
      date.getMonth() === this.selectedDateRange().end!.getMonth() &&
      date.getFullYear() === this.selectedDateRange().end!.getFullYear()
    )
  }

  isDateDisabled(date: Date): boolean {
    if (this.minDate() && date < this.minDate()!) {
      return true
    }
    if (this.maxDate() && date > this.maxDate()!) {
      return true
    }
    return false
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.viewDate().getMonth()
  }

  isSelectedMonth(month: number): boolean {
    if (this.selectionMode() === "single" && this.selectedDate()) {
      return month === this.selectedDate()!.getMonth()
    }
    return false
  }

  isSelectedYear(year: number): boolean {
    if (this.selectionMode() === "single" && this.selectedDate()) {
      return year === this.selectedDate()!.getFullYear()
    }
    return false
  }

  private generateCalendarDays(): { date: Date; disabled: boolean }[] {
    const year = this.viewDate().getFullYear()
    const month = this.viewDate().getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const daysInMonth = lastDayOfMonth.getDate()

    let firstWeekday = firstDayOfMonth.getDay()
    firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1

    const days: { date: Date; disabled: boolean }[] = []

    // Add days from previous month
    const prevMonth = new Date(year, month, 0)
    const daysInPrevMonth = prevMonth.getDate()
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const date = new Date(year, month - 1, day)
      days.push({
        date,
        disabled: this.isDateDisabled(date),
      })
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        disabled: this.isDateDisabled(date),
      })
    }

    // Add days from next month
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        disabled: this.isDateDisabled(date),
      })
    }

    return days
  }
}
