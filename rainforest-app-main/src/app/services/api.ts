import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
}

export interface OrderRequest {
  customerData: {
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
  };
  items: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface OrderItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderResponse {
  orderNumber?: string;
  customerData?: {
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
  };
  orderItems?: OrderItem[];
  total?: number;
  date?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';
  private productsCache: { data: Product[], timestamp: number } | null = null;
  private readonly CACHE_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.productsCache) {
      const now = Date.now();
      const cacheAge = now - this.productsCache.timestamp;

      if (cacheAge < this.CACHE_DURATION) {
        return new Observable(observer => {
          observer.next(this.productsCache!.data);
          observer.complete();
        });
      }
    }

    return new Observable(observer => {
      this.http.get<Product[]>(`${this.baseUrl}/products`).subscribe({
        next: (products) => {
          this.productsCache = {
            data: products,
            timestamp: Date.now()
          };
          observer.next(products);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  submitOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.baseUrl}/submit-order`, orderData);
  }
}
