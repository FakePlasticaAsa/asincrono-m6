import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['loadProducts', 'products', 'deleteProduct']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getDecodedToken', 'isAdmin']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
  
    await TestBed.configureTestingModule({
      imports: [AdminComponent], // Move AdminComponent to imports
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({ search: 'test' }) },
        },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  
    // Mock product data
    mockProductService.products.and.returnValue([
      { id: 1, name: 'Product 1', price: 100, description: 'Description 1', category: 'Category 1', reference_number: 'REF1', on_sale: false },
    ]);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    component.ngOnInit();
    expect(mockProductService.loadProducts).toHaveBeenCalled();
  });

  it('should filter products based on search query', () => {
    component.ngOnInit();
    component.search.set('Product 1');
    const filteredProducts = component.filteredProducts();
    expect(filteredProducts.length).toBe(1);
    expect(filteredProducts[0].name).toBe('Product 1');
  });

  it('should call addToCart when adding a product to the cart', () => {
    const product = { id: 1, name: 'Product 1', price: 100 };
    component.cart.addToCart(product);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(product);
  });

  it('should delete a product when onDeleteProduct is called', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Mock confirm dialog
    component.onDeleteProduct(1);
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
  });
});