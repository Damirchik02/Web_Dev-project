import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // URL API Django бэкенда
  
  // Управление состоянием пользователя
  private currentUserSubject = new BehaviorSubject<User | null>(null); // Subject для хранения текущего пользователя
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable(); // Observable для подписки на изменения состояния
  
  private platformId = inject(PLATFORM_ID); // Инъекция ID платформы (для проверки браузера/сервера)
  
  /**
   * Конструктор сервиса, загружает данные пользователя из localStorage (если он существует)
   */
  constructor(private http: HttpClient) {
    // Проверка, что код выполняется в браузере (для доступа к localStorage)
    if (isPlatformBrowser(this.platformId)) {
      // Получение сохраненных данных пользователя из localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  /**
   * Получает текущего авторизованного пользователя
   * @returns Текущий пользователь или null, если не авторизован
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Регистрирует нового пользователя
   * @param username - Имя пользователя
   * @param password - Пароль
   * @param email - Email (опционально)
   * @returns Observable с ответом от сервера
   */
  register(username: string, password: string, email?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register/`, {
      username,
      password,
      email
    }).pipe(
      tap(response => {
        // Обработка успешной регистрации
        const user: User = {
          id: response.user_id,
          username: response.username,
          token: response.token,
          isAuthenticated: true
        };
        
        // Сохранение пользователя в localStorage (только в браузере)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user); // Обновление состояния
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Registration failed'));
      })
    );
  }

  /**
   * Авторизует пользователя
   * @param username - Имя пользователя
   * @param password - Пароль
   * @returns Observable с ответом от сервера
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login/`, {
      username,
      password
    }).pipe(
      tap(response => {
        // Обработка успешного входа
        const user: User = {
          id: response.user_id,
          username: response.username,
          token: response.token,
          isAuthenticated: true
        };
        
        // Сохранение пользователя в localStorage (только в браузере)
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user); // Обновление состояния
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.error || 'Login failed'));
      })
    );
  }

  /**
   * Выходит из системы (разлогинивает пользователя)
   * @returns Observable с ответом от сервера
   */
  logout(): Observable<any> {
    // Создание заголовков с токеном авторизации
    const options = { 
      headers: { 
        'Authorization': `Token ${this.currentUserValue?.token}` 
      } 
    };

    return this.http.post<any>(`${this.apiUrl}/auth/logout/`, {}, options).pipe(
      tap(() => {
        // Очистка данных пользователя из localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null); // Обновление состояния
      }),
      catchError(error => {
        // Даже если выход не удался на сервере, очищаем локальное состояние
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
        return throwError(() => new Error('Logout failed on server'));
      })
    );
  }

  /**
   * Проверяет, авторизован ли пользователь
   * @returns true, если пользователь авторизован
   */
  isLoggedIn(): boolean {
    return this.currentUserValue !== null && this.currentUserValue.isAuthenticated;
  }
}
