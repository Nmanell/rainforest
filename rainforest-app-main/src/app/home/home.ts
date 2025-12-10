import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { Api, Product } from '../services/api';
import { ErrorMessage } from '../error-message/error-message';
import { LoadingService } from '../services/loading';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCard, ErrorMessage],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loadingService.setLoading(true);
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
        this.loadingService.setLoading(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        this.loadingService.setLoading(false);
        this.loadingService.showMessage({
          icon: 'error',
          title: 'Error',
          message: 'Failed to load products. Please try again later.',
          variant: 'error'
        });
        this.cdr.detectChanges();
      }
    });
  }
}
