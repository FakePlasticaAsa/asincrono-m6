import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ensure ReactiveFormsModule is imported
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  productForm: FormGroup;
  product: any = null; // Store product data after submission

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      referenceNumber: ['', Validators.required],
      productName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(500)],
      productType: ['', Validators.required],
      productOnSale: [false],
      productImage: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.product = this.productForm.value; // Store form data
      console.log('Form Data:', this.product);
      this.productForm.reset(); // Reset form after submission
    } else {
      console.log('Form is invalid');
    }
  }

  getControl(controlName: string) {
    return this.productForm.get(controlName);
  }
}
