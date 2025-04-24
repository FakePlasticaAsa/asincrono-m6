import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartDrawerComponent } from './cart-drawer.component';
import { CartService } from '../services/cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('CartDrawerComponent', () => {
  let component: CartDrawerComponent;
  let fixture: ComponentFixture<CartDrawerComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Create a spy object for CartService
    cartServiceSpy = jasmine.createSpyObj('CartService', ['removeFromCart', 'clearCart']);
    
    // Mock the cartItems signal with a simple function
    // We'll use a type assertion to avoid TypeScript errors
    (cartServiceSpy as any).cartItems = () => [
      { id: 1, name: 'Product 1', price: 10, quantity: 2 },
      { id: 2, name: 'Product 2', price: 20, quantity: 1 }
    ];

    await TestBed.configureTestingModule({
      imports: [CartDrawerComponent, HttpClientTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle drawer state', () => {
    expect(component.cartOpen()).toBeFalse();
    component.toggleDrawer();
    expect(component.cartOpen()).toBeTrue();
    component.toggleDrawer();
    expect(component.cartOpen()).toBeFalse();
  });

  it('should calculate total correctly', () => {
    // Total should be (10 * 2) + (20 * 1) = 40
    expect(component.total()).toBe(40);
  });

  it('should call removeFromCart when removing an item', () => {
    component.removeItem(1);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should process checkout successfully', () => {
    // Spy on console.error and alert
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    // Spy on cartOpen.set
    spyOn(component.cartOpen, 'set');
    
    // Call checkout
    component.checkout();
    
    // Verify HTTP request
    const req = httpMock.expectOne('http://100.123.97.64:3000/auth/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      items: [
        { product_id: 1, quantity: 2 },
        { product_id: 2, quantity: 1 }
      ]
    });
    
    // Simulate successful response
    req.flush({ message: 'Order created', orderId: 123 });
    
    // Verify cart was cleared and drawer was closed
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    expect(component.cartOpen.set).toHaveBeenCalledWith(false);
  });

  it('should handle checkout error', () => {
    // Spy on console.error and alert
    spyOn(console, 'error');
    spyOn(window, 'alert');
    
    // Call checkout
    component.checkout();
    
    // Simulate error response
    const req = httpMock.expectOne('http://100.123.97.64:3000/auth/orders');
    req.error(new ErrorEvent('Network error'));
    
    // Verify error handling
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al procesar la compra');
  });
});
