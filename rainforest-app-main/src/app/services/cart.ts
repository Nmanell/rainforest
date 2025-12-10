import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private readonly STORAGE_KEY = 'cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  constructor() {}

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value;
  }

  getItemQuantity(productId: number): number {
    const item = this.cartSubject.value.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  addToCart(productId: number, quantity: number = 1): void {
    const cart = this.cartSubject.value;
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }

    this.saveCart(cart);
    this.cartSubject.next(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const cart = this.cartSubject.value;
    const item = cart.find(item => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.saveCart(cart);
        this.cartSubject.next(cart);
      }
    }
  }

  removeFromCart(productId: number): void {
    const cart = this.cartSubject.value.filter(item => item.id !== productId);
    this.saveCart(cart);
    this.cartSubject.next(cart);
  }

  clearCart(): void {
    this.saveCart([]);
    this.cartSubject.next([]);
  }

  getTotalItems(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  private loadCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  }

  private saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
}
