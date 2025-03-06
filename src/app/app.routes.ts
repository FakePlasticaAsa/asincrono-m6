import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
];
