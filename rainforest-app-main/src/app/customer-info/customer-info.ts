import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart as CartService } from '../services/cart';
import { Api } from '../services/api';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Component({
  selector: 'app-customer-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-info.html',
  styleUrl: './customer-info.css',
})
export class CustomerInfo implements OnInit {
  customerData = {
    firstName: '',
    lastName: '',
    email: '',
    address: {
      street: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  };

  cartItems: CartItem[] = [];
  loading = true;

  constructor(
    private router: Router,
    private cartService: CartService,
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    const cartItems = this.cartService.getCartItems();

    if (cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.api.getProducts().subscribe({
      next: (products) => {
        this.cartItems = cartItems.map(cartItem => {
          const product = products.find(p => p.id === cartItem.id);
          if (product) {
            return {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: cartItem.quantity,
              imageUrl: product.imageUrl
            };
          }
          return null;
        }).filter(item => item !== null) as CartItem[];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.router.navigate(['/cart']);
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

  onSubmit() {
    if (this.isFormValid()) {
      const cartItems = this.cartService.getCartItems();

      const orderData = {
        customerData: this.customerData,
        items: cartItems
      };

      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
      this.router.navigate(['/confirmation']);
    }
  }

  onBack() {
    this.router.navigate(['/cart']);
  }

  private isFormValid(): boolean {
    return !!(
      this.customerData.firstName &&
      this.customerData.lastName &&
      this.customerData.email &&
      this.customerData.address.street &&
      this.customerData.address.city &&
      this.customerData.address.state &&
      this.customerData.address.zipCode &&
      this.customerData.address.country
    );
  }
}
