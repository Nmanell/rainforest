import { Routes } from '@angular/router';
import { Home } from './home/home'
import { Cart } from './cart/cart';
import { CustomerInfo } from './customer-info/customer-info';
import { Confirmation } from './confirmation/confirmation';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: Cart },
  { path: 'information', component: CustomerInfo },
  { path: 'confirmation', component: Confirmation },
];
