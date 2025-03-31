import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { CartDrawerComponent } from '../cart-drawer/cart-drawer.component'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, CartDrawerComponent, CommonModule], // Add FormsModule here
  templateUrl: './header.component.html',
  
})
export class HeaderComponent {
  searchQuery: string = '';
  username = '';
  cartOpen = false;

  constructor(private router: Router, public authService: AuthService, public cart: CartService) {}
  onLogout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login']);  
  }
  handleSearch() {
    this.router.navigate(['/admin'], { queryParams: { search: this.searchQuery } }); // Navigate with query params
  }

}
