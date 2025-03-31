import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://100.123.97.64:3000/auth/products';
  private http = inject(HttpClient);

  products = signal<any[]>([]);

  loadProducts() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => this.products.set(data),
      error: err => console.error('Error cargando productos', err),
    });
  }

  addProduct(formValue: any) {
    const product = {
      reference_number: formValue.referenceNumber,
      name: formValue.productName,
      description: formValue.description,
      price: formValue.price,
      stock: formValue.stock,
      image: formValue.productImage,
      category: formValue.productType,
      on_sale: formValue.productOnSale === true 
        };
    
  
    this.http.post<any>(this.apiUrl, product).subscribe({
      next: response => {
        const updated = [...this.products(), { ...product, id: response.productId }];
        this.products.set(updated);
      },
      error: err => console.error('Error al crear producto', err),
    });
  }
  deleteProduct(id: number) {
    this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        // Filtra el producto eliminado del signal
        const updated = this.products().filter(p => p.id !== id);
        this.products.set(updated);
      },
      error: err => console.error('Error al eliminar producto', err),
    });
  }
  

  getProducts() {
    return this.products();
  }
}
