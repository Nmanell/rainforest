import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '../cart/cart';
import { QuantityCounter } from '../quantity-counter/quantity-counter';

@Component({
  selector: 'app-cart-product',
  imports: [QuantityCounter],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.css',
})
export class CartProduct {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  get itemTotal(): number {
    return this.item.price * this.item.quantity;
  }

  onQuantityChange(newQuantity: number): void {
    this.quantityChange.emit(newQuantity);
  }

  removeItem(): void {
    this.remove.emit();
  }
}
