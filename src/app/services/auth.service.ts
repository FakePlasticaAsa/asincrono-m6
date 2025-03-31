import { inject, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CartService } from './cart.service'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://100.123.97.64:3000/auth';
  private http = inject(HttpClient);
  private cart = inject(CartService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.cart.clearCart(); // 👈 limpiamos el carrito también
    }
  }

  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nombre, email, password });
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, data);
  }

  isAuthenticated(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          return decoded?.role_id === 1;
        } catch (error) {
          console.warn('Token inválido:', error);
          return false;
        }
      }
    }
    return false;
  }
  

  getDecodedToken(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) return jwtDecode(token);
    }
    return null;
  }
}
