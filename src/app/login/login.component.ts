import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  login(): void {
    if (this.loginForm.invalid) return;
  
    const { email, password } = this.loginForm.value;
  
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.authService.getProfile().subscribe({
          next: profile => {
            console.log('Nombre del usuario:', profile.name);
            localStorage.setItem('username', profile.name);
            this.router.navigate(['/home']);
          },
          error: err => console.error('Error obteniendo perfil', err),
        });
      },
      error: err => console.error('Login failed', err),
    });
  }
  
}
