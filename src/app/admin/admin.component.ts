import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { CartService } from '../services/cart.service'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  search = signal('');
  isAdmin = signal(false);

  constructor(
    public productService: ProductService,
    private route: ActivatedRoute,
    public authService: AuthService,
    public cart: CartService
  ) {}
  ngOnInit() {
    this.productService.loadProducts();

    const user = this.authService.getDecodedToken();
    

    this.route.queryParams.subscribe(params => {
      this.search.set(params['search'] || '');
    });
  }
  onDeleteProduct(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id);
    }
  }
  
  // Products filtrados dinámicamente
  filteredProducts = computed(() =>
    this.productService.products().filter(product =>
      product.name.toLowerCase().includes(this.search().toLowerCase())
    )
  );
}
