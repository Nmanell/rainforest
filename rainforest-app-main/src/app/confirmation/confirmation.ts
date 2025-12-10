import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Api, OrderItem } from '../services/api';
import { Cart as CartService } from '../services/cart';
import { ErrorMessage } from '../error-message/error-message';
import { LoadingService } from '../services/loading';

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

@Component({
  selector: 'app-confirmation',
  imports: [CommonModule, RouterLink, ErrorMessage],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})

export class Confirmation implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';

  orderNumber = '';
  orderDate = '';
  errorMessage = '';

  customerData: CustomerData = {
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

  orderItems: OrderItem[] = [];

  constructor(
    private api: Api,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.submitOrder();
  }

  submitOrder() {
    const pendingOrderStr = sessionStorage.getItem('pendingOrder');

    if (!pendingOrderStr) {
      this.router.navigate(['/cart']);
      return;
    }

    const orderRequest = JSON.parse(pendingOrderStr);
    sessionStorage.removeItem('pendingOrder');

    this.status = 'loading';
    this.loadingService.setLoading(true);

    this.api.submitOrder(orderRequest).subscribe({
      next: (response) => {
        if (response.error) {
          this.status = 'error';
          this.errorMessage = response.error;

          this.loadingService.setLoading(false);
          this.loadingService.showMessage({
            icon: 'error',
            title: 'Order Failed',
            message: this.errorMessage,
            variant: 'error'
          });

        } else {
          this.status = 'success';
          this.orderNumber = response.orderNumber || '';
          this.customerData = response.customerData || this.customerData;
          this.orderItems = response.orderItems || [];
          this.orderDate = response.date || '';

          this.orderItems.forEach(item => {
            this.cartService.removeFromCart(item.id);
          });

          this.loadingService.setLoading(false);
          this.loadingService.showMessage({
            icon: 'check_circle',
            title: 'Order Confirmed',
            message: `Order #${this.orderNumber}`,
            rightText: this.orderDate,
            variant: 'success'
          });
        }

        this.cdr.detectChanges();
      },

      error: () => {
        this.status = 'error';
        this.errorMessage = 'An unexpected error occurred. Please try again.';

        this.loadingService.setLoading(false);
        this.loadingService.showMessage({
          icon: 'error',
          title: 'Order Error',
          message: this.errorMessage,
          variant: 'error'
        });

        this.cdr.detectChanges();
      }
    });
  }

  get subtotal() { return this.orderItems.reduce((s,i)=>s+i.price*i.quantity,0); }
  get tax() { return this.subtotal * 0.08; }
  get total() { return this.subtotal + this.tax; }
}
