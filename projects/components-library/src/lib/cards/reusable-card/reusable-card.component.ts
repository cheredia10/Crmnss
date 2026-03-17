import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface CardClickEvent {
  title: string
  content: string
  imageUrl: string
}

@Component({
  selector: 'lib-reusable-card',
  imports: [NgOptimizedImage],
  templateUrl: './reusable-card.component.html',
  styleUrl: './reusable-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReusableCardComponent {
  // Input signals
  imageUrl = input.required<string>()
  title = input.required<string>()
  content = input.required<string>()
  width = input<number>(360)
  height = input<number>(300)
  imageAlt = input<string>("Card image")

  // Output signal
  cardClick = output<CardClickEvent>()

  handleCardClick(): void {
    this.cardClick.emit({
      title: this.title(),
      content: this.content(),
      imageUrl: this.imageUrl(),
    })
  }
}
