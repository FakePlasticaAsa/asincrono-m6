import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    // Create a spy object for CartService
    cartServiceSpy = jasmine.createSpyObj('CartService', ['clearCart']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: CartService, useValue: cartServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' } // Mock browser platform
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Spy on localStorage
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unexpected requests were made
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request and store token', () => {
      const testToken = 'test-token';
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      
      service.login(testEmail, testPassword).subscribe(response => {
        expect(response.token).toBe(testToken);
      });
      
      const req = httpMock.expectOne('http://100.123.97.64:3000/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: testEmail, password: testPassword });
      
      req.flush({ token: testToken });
      
      expect(localStorage.setItem).toHaveBeenCalledWith('token', testToken);
    });
  });

  describe('logout', () => {
    it('should remove token and clear cart', () => {
      service.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(cartServiceSpy.clearCart).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('test-token');
      expect(service.isAuthenticated()).toBeTrue();
    });
    
    it('should return false when token does not exist', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      // Valid JWT with role_id: 1 (admin)
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjoxLCJpYXQiOjE2MTYxNjM2MDAsImV4cCI6MTYxNjI1MDAwMH0.1234567890';
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);
      expect(service.isAdmin()).toBeTrue();
    });
    
    it('should return false for non-admin role', () => {
      // Valid JWT with role_id: 2 (non-admin)
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjoyLCJpYXQiOjE2MTYxNjM2MDAsImV4cCI6MTYxNjI1MDAwMH0.1234567890';
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);
      expect(service.isAdmin()).toBeFalse();
    });
    
    it('should return false when token is invalid', () => {
      const mockToken = 'invalid-token';
      (localStorage.getItem as jasmine.Spy).and.returnValue(mockToken);
      expect(service.isAdmin()).toBeFalse();
    });
  });
}); 