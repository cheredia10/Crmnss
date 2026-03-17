import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-rating',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements ControlValueAccessor, OnInit {
  @Input() max: number = 5;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: string = '#FFD700';
  @Input() emptyColor: string = '#E0E0E0';
  
  @Output() ratingChange = new EventEmitter<number>();
  @Output() hover = new EventEmitter<number>();
  @Output() leave = new EventEmitter<void>();

  private _value: number = 0;
  hoveredStar: number = 0;
  stars: number[] = [];

  // ControlValueAccessor methods
  private onChange = (value: number) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.stars = Array(this.max).fill(0).map((x, i) => i + 1);
  }

  get value(): number {
    return this._value;
  }

  set value(val: number) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  writeValue(value: number): void {
    this._value = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onStarClick(rating: number): void {
    if (this.disabled || this.readonly) return;
    
    // Toggle functionality: if clicking the same star, set to 0
    if (this.value === rating) {
      this.value = 0;
    } else {
      this.value = rating;
    }
    
    this.ratingChange.emit(this.value);
  }

  onStarHover(rating: number): void {
    if (this.disabled || this.readonly) return;
    
    this.hoveredStar = rating;
    this.hover.emit(rating);
  }

  onMouseLeave(): void {
    this.hoveredStar = 0;
    this.leave.emit();
  }

  getStarClass(starNumber: number): string {
    const isActive = starNumber <= (this.hoveredStar || this.value);
    const baseClass = 'star';
    const sizeClass = `star-${this.size}`;
    const stateClass = isActive ? 'star-active' : 'star-empty';
    const disabledClass = this.disabled ? 'star-disabled' : '';
    const readonlyClass = this.readonly ? 'star-readonly' : '';
    
    return [baseClass, sizeClass, stateClass, disabledClass, readonlyClass]
      .filter(Boolean)
      .join(' ');
  }

  getStarColor(starNumber: number): string {
    const isActive = starNumber <= (this.hoveredStar || this.value);
    return isActive ? this.color : this.emptyColor;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }
}
