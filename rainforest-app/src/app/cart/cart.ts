import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartProduct } from '../cart-product/cart-product';
import { Cart as CartService } from '../services/cart';
import { Api } from '../services/api';
import { ErrorMessage } from '../error-message/error-message';
import { LoadingService } from '../services/loading';
import { Subscription } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CartProduct, RouterLink, ErrorMessage],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  loading = true;
  error: string | null = null;
  private cartSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadCart();

    this.cartSubscription = this.cartService.getCart().subscribe(() => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    this.cartSubscription?.unsubscribe();
  }

  loadCart() {
    const cartItems = this.cartService.getCartItems();

    if (cartItems.length === 0) {
      this.cartItems = [];
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loadingService.setLoading(true);
    this.api.getProducts().subscribe({
      next: (products) => {
        this.cartItems = cartItems.map(cartItem => {
          const product = products.find(p => p.id === cartItem.id);
          if (product) {
            return {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              quantity: cartItem.quantity,
              image: product.imageUrl
            };
          }
          return null;
        }).filter(item => item !== null) as CartItem[];

        this.loading = false;
        this.loadingService.setLoading(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load cart items. Please try again later.';
        this.loading = false;
        this.loadingService.setLoading(false);
        this.loadingService.showMessage({
          icon: 'error',
          title: 'Error',
          message: 'Failed to load cart items. Please try again later.',
          variant: 'error'
        });
        this.cdr.detectChanges();
      }
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get tax(): number {
    return this.subtotal * 0.08;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  onQuantityChange(item: CartItem, newQuantity: number): void {
    this.cartService.updateQuantity(item.id, newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    const hasInvalidItems = this.cartItems.some(item => item.quantity <= 0);
    if (hasInvalidItems) {
      alert('Some items have invalid quantities. Please update your cart.');
      return;
    }

    this.router.navigate(['/information']);
  }
}
