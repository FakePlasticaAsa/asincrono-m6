import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppComponent, 
        ReactiveFormsModule, 
        HttpClientTestingModule
      ],
      providers: [
        { provide: HeaderComponent, useValue: {} },
        { provide: FooterComponent, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should create a product form with required fields', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.productForm).toBeTruthy();
    expect(app.productForm.get('referenceNumber')).toBeTruthy();
    expect(app.productForm.get('productName')).toBeTruthy();
    expect(app.productForm.get('price')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const form = app.productForm;
    
    expect(form.valid).toBeFalsy();
    
    form.controls['referenceNumber'].setValue('ABC123');
    form.controls['productName'].setValue('Test Product');
    form.controls['price'].setValue(100);
    form.controls['productType'].setValue('Sports');
    form.controls['productImage'].setValue('test.jpg');
    
    expect(form.valid).toBeTruthy();
  });
});
