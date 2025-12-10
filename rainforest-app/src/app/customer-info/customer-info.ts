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

  usStates = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  filteredStates = [...this.usStates];
  showStateDropdown = false;
  selectedStateIndex = -1;

  constructor(
    private router: Router,
    private cartService: CartService,
    private api: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCart();
    this.customerData.address.country = 'United States';
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

  onStateInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;

    if (input.length > 0) {
      const searchTerm = input.toLowerCase();
      this.filteredStates = this.usStates.filter(state =>
        state.code.toLowerCase().includes(searchTerm) ||
        state.name.toLowerCase().includes(searchTerm)
      );
      this.showStateDropdown = this.filteredStates.length > 0;
      this.selectedStateIndex = -1;
    } else {
      this.filteredStates = [...this.usStates];
      this.showStateDropdown = false;
      this.selectedStateIndex = -1;
    }
  }

  onStateKeyDown(event: KeyboardEvent) {
    if (!this.showStateDropdown || this.filteredStates.length === 0) {
      return;
    }

    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedStateIndex = Math.min(this.selectedStateIndex + 1, this.filteredStates.length - 1);
        this.scrollToSelectedState();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedStateIndex = Math.max(this.selectedStateIndex - 1, 0);
        this.scrollToSelectedState();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedStateIndex >= 0 && this.selectedStateIndex < this.filteredStates.length) {
          this.selectState(this.filteredStates[this.selectedStateIndex].code);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.showStateDropdown = false;
        this.selectedStateIndex = -1;
        break;
    }
  }

  private scrollToSelectedState() {
    this.cdr.detectChanges();
    setTimeout(() => {
      const selectedElement = document.querySelector('.state-dropdown-item.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  selectState(stateCode: string) {
    this.customerData.address.state = stateCode;
    this.showStateDropdown = false;
    this.filteredStates = [...this.usStates];
    this.selectedStateIndex = -1;
  }

  onStateFocus() {
    if (this.customerData.address.state.length === 0) {
      this.filteredStates = [...this.usStates];
      this.showStateDropdown = true;
      this.selectedStateIndex = -1;
    }
  }

  onStateBlur() {
    setTimeout(() => {
      this.showStateDropdown = false;
      this.selectedStateIndex = -1;
    }, 200);
  }

  onZipCodeInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;

    const digitsOnly = input.replace(/\D/g, '');
    this.customerData.address.zipCode = digitsOnly.substring(0, 5);
  }

  isValidZipCode(): boolean {
    const zipCode = this.customerData.address.zipCode;
    return /^\d{5}$/.test(zipCode);
  }

  isValidState(): boolean {
    if (!this.customerData.address.state) {
      return true;
    }
    return this.usStates.some(state => state.code === this.customerData.address.state);
  }

  private isFormValid(): boolean {
    return !!(
      this.customerData.firstName &&
      this.customerData.lastName &&
      this.customerData.email &&
      this.customerData.address.street &&
      this.customerData.address.city &&
      this.customerData.address.state &&
      this.isValidState() &&
      this.customerData.address.zipCode &&
      this.isValidZipCode()
    );
  }
}
