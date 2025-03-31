import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred. Please try again.';
      },
    });
  }
}
