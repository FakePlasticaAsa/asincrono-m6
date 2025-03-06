import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  constructor(public productService: ProductService) {} 
}
