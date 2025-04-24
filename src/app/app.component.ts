import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
enum ProductType {
  Sports = 'Sports',
  Casual = 'Casual',
  Formal = 'Formal',
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ReactiveFormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  productForm: FormGroup;
  productTypes = Object.values(ProductType);

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      referenceNumber: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{6,10}$')]],
      productName: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.maxLength(500)],
      productType: ['', Validators.required],
      productOnSale: [false],
      productImage: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]+\.(png|jpg|jpeg)$')]],
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Product Data:', this.productForm.value);
    } else {
      console.log('Form Invalid!');
    }
  }

  getControl(controlName: string) {
    return this.productForm.get(controlName);
  }
}
