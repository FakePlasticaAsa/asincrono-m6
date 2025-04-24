import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.css'],
})
export class CartDrawerComponent {
  cartOpen = signal(false);

  constructor(public cart: CartService, private http: HttpClient) {}

  toggleDrawer() {
    this.cartOpen.update(open => !open);
  }

  total = computed(() =>
    this.cart.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  removeItem(id: number) {
    this.cart.removeFromCart(id);
  }

  checkout() {
    const items = this.cart.cartItems().map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    this.http.post<{ message: string; orderId: number }>('http://100.123.97.64:3000/auth/orders', { items })
      .subscribe({
        next: res => {
          this.cart.clearCart();
          this.cartOpen.set(false);
        },
        error: err => {
          console.error('Error al crear la orden', err);
          alert('Error al procesar la compra');
        }
      });
  }
}
