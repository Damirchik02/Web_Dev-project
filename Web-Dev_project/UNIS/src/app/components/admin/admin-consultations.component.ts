import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../services/university.service';
import { ConsultationRequest } from '../../models/consultation.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-consultations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2>Consultation Requests Admin</h2>
      
      <!-- Индикатор загрузки данных -->
      <div *ngIf="loading">Loading consultation requests...</div>
      
      <!-- Отображение ошибок -->
      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <!-- Таблица заявок на консультацию -->
      <div *ngIf="!loading && !error">
        <table class="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Циклический проход по всем заявкам -->
            <tr *ngFor="let request of consultationRequests">
              <td>{{ request.id }}</td>
              <td>{{ request.user?.username || 'Unknown' }}</td>
              <td>{{ request.message }}</td>
              <td>{{ request.date | date:'medium' }}</td>
              <td>
                <!-- Статус заявки с цветовым обозначением -->
                <span [ngClass]="'status-' + request.status">
                  {{ request.status }}
                </span>
              </td>
              <td>
                <!-- Кнопки действий: завершить или отклонить заявку -->
                <button (click)="updateStatus(request.id!, 'completed')" 
                  [disabled]="request.status === 'completed'"
                  class="btn-action complete">
                  Complete
                </button>
                <button (click)="updateStatus(request.id!, 'rejected')"
                  [disabled]="request.status === 'rejected'"
                  class="btn-action reject">
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Сообщение, если нет заявок -->
        <div *ngIf="consultationRequests.length === 0" class="no-results">
          <p>No consultation requests found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .requests-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    
    .requests-table th, .requests-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    .requests-table th {
      background-color: #f2f2f2;
    }
    
    .requests-table tr:hover {
      background-color: #f5f5f5;
    }
    
    /* Стили для различных статусов заявок */
    .status-pending {
      color: #e67e22;
      font-weight: bold;
    }
    
    .status-completed {
      color: #27ae60;
      font-weight: bold;
    }
    
    .status-rejected {
      color: #e74c3c;
      font-weight: bold;
    }
    
    /* Стили для кнопок действий */
    .btn-action {
      padding: 6px 12px;
      margin-right: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .btn-action.complete {
      background-color: #27ae60;
      color: white;
    }
    
    .btn-action.reject {
      background-color: #e74c3c;
      color: white;
    }
    
    .btn-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .error {
      color: red;
      padding: 10px;
      background-color: #ffeeee;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  `]
})
export class AdminConsultationsComponent implements OnInit {
  // Массив для хранения всех заявок на консультацию
  consultationRequests: ConsultationRequest[] = [];
  // Флаг загрузки данных
  loading = true;
  // Сообщение об ошибке (null, если ошибок нет)
  error: string | null = null;
  
  constructor(
    private universityService: UniversityService, // Сервис для работы с API университетов и заявок
    private authService: AuthService, // Сервис для аутентификации
    private router: Router // Для навигации между страницами
  ) { }
  
  ngOnInit(): void {
    // Проверка авторизации: если пользователь не авторизован, перенаправление на страницу входа
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Загрузка заявок на консультацию при инициализации компонента
    this.loadConsultationRequests();
  }
  
  /**
   * Загружает все заявки на консультацию с сервера
   */
  loadConsultationRequests(): void {
    this.loading = true;
    // Вызов метода сервиса для получения заявок через API
    this.universityService.getConsultationRequests().subscribe({
      next: (data) => {
        // Успешное получение данных
        this.consultationRequests = data;
        this.loading = false;
      },
      error: (err) => {
        // Обработка ошибки
        this.error = `Error loading consultation requests: ${err.message}`;
        this.loading = false;
      }
    });
  }
  
  /**
   * Обновляет статус заявки на консультацию
   * @param id - ID заявки
   * @param status - Новый статус ('pending', 'completed' или 'rejected')
   */
  updateStatus(id: number, status: 'pending' | 'completed' | 'rejected'): void {
    // Этот метод нужно реализовать в сервисе, чтобы обновлять данные на сервере
    /*
    this.universityService.updateConsultationRequestStatus(id, status).subscribe({
      next: () => {
        // Обновление локального состояния для отражения изменения
        const request = this.consultationRequests.find(r => r.id === id);
        if (request) {
          request.status = status;
        }
      },
      error: (err) => {
        this.error = `Error updating status: ${err.message}`;
      }
    });
    */
    
    // На данный момент просто обновляем UI (без отправки на сервер)
    const request = this.consultationRequests.find(r => r.id === id);
    if (request) {
      request.status = status;
    }
  }
} 