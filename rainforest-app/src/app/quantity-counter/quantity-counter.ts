import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-counter',
  imports: [CommonModule],
  templateUrl: './quantity-counter.html',
  styleUrl: './quantity-counter.css',
  standalone: true,
})
export class QuantityCounter {
  @Input() quantity: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 99;
  @Output() quantityChange = new EventEmitter<number>();

  increment() {
    if (this.quantity < this.max) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  decrement() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}
