import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityCounter } from '../quantity-counter/quantity-counter';
import { Cart } from '../services/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, QuantityCounter],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit, OnDestroy {
  @Input() id!: number;
  @Input() name!: string;
  @Input() price!: number;
  @Input() image!: string;
  @Input() description!: string;

  quantity: number = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: Cart) {}

  ngOnInit() {
    this.quantity = this.cartService.getItemQuantity(this.id);
    this.cartSubscription = this.cartService.getCart().subscribe(() => {
      this.quantity = this.cartService.getItemQuantity(this.id);
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }

  addToCart() {
    this.cartService.addToCart(this.id, 1);
  }

  onQuantityChange(newQuantity: number) {
    this.cartService.updateQuantity(this.id, newQuantity);
  }
}
