import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editing = false;
  successMessage = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: user => {
        this.profileForm = this.fb.group({
          name: [user.name],
          email: [user.email],
          address: [user.address],
          phone: [user.phone],
          password: ['']  // Opcional: solo se cambia si se rellena
        });
      },
      error: err => console.error('Error cargando perfil', err),
    });
  }

  enableEditing() {
    this.editing = true;
  }

  saveChanges() {
    if (this.profileForm.invalid) return;

    const data = this.profileForm.value;

    // No enviar campo vacío como contraseña
    if (!data.password) {
      delete data.password;
    }

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.editing = false;
      },
      error: err => console.error('Error al actualizar perfil', err),
    });
  }
}
