import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://100.123.97.64:3000/auth/orders').subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar órdenes', err);
        this.loading = false;
      }
    });
  }
}
