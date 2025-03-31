import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  formSubmitted = false; 

  constructor(private fb: FormBuilder, public productService: ProductService) { 
    this.productForm = this.fb.group({
      referenceNumber: ['', Validators.required],
      productName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [10, [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(500)],
      productType: ['', Validators.required],
      productOnSale: [false],
      productImage: ['', Validators.required],
    });
    
  }

  getControl(controlName: string) {
    return this.productForm.get(controlName);
  }
  
  ngOnInit() {
    this.productService.loadProducts();
  }
  
  onSubmit() {
    this.formSubmitted = true; 
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value); 
      console.log('Form Data:', this.productService.products());
      this.productForm.reset();
      this.formSubmitted = false; 
    } else {
      console.log('Form is invalid');
    }
  }
}