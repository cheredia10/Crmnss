
import { ChangeDetectionStrategy, Component, computed, effect, input, model, output, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ViewMode = "day" | "month" | "year"
type SelectionMode = "single" | "range" | "multiple"

@Component({
  selector: 'lib-date-picker',
  imports: [],
  standalone: true,
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  encapsulation: ViewEncapsulation.None, // Cuidado con esto, puede afectar estilos globales.
  changeDetection: ChangeDetectionStrategy.OnPush, // BEST PRACTICE: Siempre OnPush
})
export class DatePickerComponent {
  // Inputs
  theme = input<"light" | "dark">("light")
  selectionMode = input<SelectionMode>("single")
  minDate = input<Date | null>(null)
  maxDate = input<Date | null>(null)


  // Model value
  isOpen = model(false);
  selectedDate = model<Date | null>(null)
  selectedDateRange = model<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  selectedDates = model<Date[]>([])

  // Outputs
  dateChange = output<Date | null>()
  dateRangeChange = output<{ start: Date | null; end: Date | null }>()
  datesChange = output<Date[]>()

  // Internal state
  currentDate = signal(new Date())
  viewMode = signal<ViewMode>("day")
  viewDate = signal(this.selectedDate() ?? new Date())


  constructor() {
    // Effect para emitir cambios basados en el modo de selección
    effect(() => {
      if (this.selectionMode() === 'single' && this.selectedDate()) {
        this.dateChange.emit(this.selectedDate());
      } else if (this.selectionMode() === 'range' && (this.selectedDateRange().start || this.selectedDateRange().end)) {
        this.dateRangeChange.emit(this.selectedDateRange());
      } else if (this.selectionMode() === 'multiple' && this.selectedDates().length) {
        this.datesChange.emit(this.selectedDates());
      }
    });
  }

  // Computed values
  monthName = computed(() => new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.viewDate()));
  year = computed(() => this.viewDate().getFullYear());

  calendarDays = computed(() => this.generateCalendarDays())

  monthsOfYear = computed(() => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date(this.viewDate().getFullYear(), i, 1)
      months.push({
        name: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date),
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
    const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
    // Lunes (2023-01-02) a Domingo
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(2023, 0, 2 + i);
      const day = formatter.format(date);
      return day.charAt(0).toUpperCase() + day.slice(1, 3);
    });
  });

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
      this.isOpen.set(false);
    } else if (this.selectionMode() === "range") {
      const currentRange = this.selectedDateRange()

      if (!currentRange.start || (currentRange.start && currentRange.end)) {
        // Start new range
        this.selectedDateRange.set({ start: date, end: null })
      } else {
        // Complete the range
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

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstWeekday = firstDayOfMonth.getDay()
    // Adjust for Monday as first day of week
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
    const remainingDays = 42 - days.length // 6 rows of 7 days
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
