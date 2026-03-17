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
  selector: 'lib-calendar-1',
  standalone: true,
  imports: [],
  templateUrl: './calendar-1.component.html',
  styleUrl: './calendar-1.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calendar1Component {
  private elementRef = inject(ElementRef)
  protected locale = inject(LOCALE_ID)

  @ViewChild("calendarContainer", { static: false }) calendarContainer!: ElementRef

  // Inputs
  theme = input<"light" | "dark">("light")
  selectionMode = input<SelectionMode>("single")
  minDate = input<Date | null>(null)
  maxDate = input<Date | null>(null)
  triggerElement = input<HTMLElement | null>(null)

  // i18n: Textos configurables desde la app padre
  calendarAriaLabel = input<string>('Calendario')
  previousMonthAriaLabel = input<string>('Mes anterior')
  nextMonthAriaLabel = input<string>('Mes siguiente')
  previousYearAriaLabel = input<string>('Año anterior')
  nextYearAriaLabel = input<string>('Año siguiente')
  switchToMonthViewAriaLabel = input<string>('Cambiar a vista de meses')
  switchToYearViewAriaLabel = input<string>('Cambiar a vista de años')
  selectMonthAriaLabel = input<string>('Seleccionar mes')
  selectYearAriaLabel = input<string>('Seleccionar año')
  yearPrefix = input<string>('Año')

  // Model values
  selectedDate = model<Date | null>(new Date())
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
    // Component initialized as static calendar
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
