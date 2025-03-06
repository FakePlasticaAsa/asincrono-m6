import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class ProductService {
  products = signal<any[]>([]); 

  addProduct(product: any) {
    this.products.set([...this.products(), product]); 
  }

  getProducts() {
    return this.products();
  }
}
