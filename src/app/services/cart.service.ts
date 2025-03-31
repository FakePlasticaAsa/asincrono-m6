import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private STORAGE_KEY = 'cart';
  private EXPIRATION_MINUTES = 10;

  private platformId = inject(PLATFORM_ID);
  cartItems = signal<any[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();

      effect(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
          data: this.cartItems(),
          expiresAt: Date.now() + this.EXPIRATION_MINUTES * 60 * 1000
        }));
      });
    }
  }

  private loadCart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();

        if (parsed.expiresAt && now < parsed.expiresAt) {
          this.cartItems.set(parsed.data);
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  addToCart(product: any) {
    const existing = this.cartItems().find(p => p.id === product.id);
    if (!existing) {
      this.cartItems.set([...this.cartItems(), { ...product, quantity: 1 }]);
    } else {
      const updated = this.cartItems().map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      );
      this.cartItems.set(updated);
    }
  }

  removeFromCart(id: number) {
    this.cartItems.set(this.cartItems().filter(p => p.id !== id));
  }

  clearCart() {
    this.cartItems.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
